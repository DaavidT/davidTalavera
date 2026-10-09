/**
 * PixelGrid — canvas-2D animated background.
 *
 * A chunky pointy-top hexagon grid (honeycomb) painted at CSS pixel
 * resolution (intentionally NO devicePixelRatio scaling: the upscaled
 * pixels are the aesthetic) with:
 *   - a subtle ambient twinkle driven by each cell's own random cycle,
 *   - a pointer/touch color trail whose brush width scales with speed,
 *   - per-frame alpha decay back to the ambient base color,
 *   - autonomous motion until the first real pointer input,
 *   - light/dark theme awareness driven by the container's `--pb-ambient`
 *     custom property (system preference + `html.dark`/`html.light`).
 *
 * Rendering uses a single ImageData buffer written through a Uint32Array
 * view (packed little-endian RGBA) and one putImageData() call per frame.
 */

/** RGBA color tuple: [red, green, blue, alpha]. */
export type RGBA = [number, number, number, number];

/** RGB color tuple: [red, green, blue]. */
export type RGB = [number, number, number];

/** A single hexagon cell of the grid. */
export interface PixelCell {
  /** Integer x coordinate (pixel anchor) of the hexagon center. */
  x: number;
  /** Integer y coordinate (pixel anchor) of the hexagon center. */
  y: number;
  /** Random idle offset of the twinkle cycle, in milliseconds. */
  delay: number;
  /** Length of the active twinkle phase, in milliseconds. */
  duration: number;
  /** Current color, mutated in place while the animation runs. */
  color: RGBA;
}

/** Exact 18-color palette used by the pointer trail. */
const PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [26, 188, 156],
  [46, 204, 113],
  [52, 152, 219],
  [155, 89, 182],
  [52, 73, 94],
  [22, 160, 133],
  [39, 174, 96],
  [41, 128, 185],
  [142, 68, 173],
  [44, 62, 80],
  [241, 196, 15],
  [230, 126, 34],
  [231, 76, 60],
  [236, 240, 241],
  [243, 156, 18],
  [211, 84, 0],
  [192, 57, 43],
  [254, 174, 188],
];

// Hexagonal (pointy-top) honeycomb layout.
const DESKTOP_MIN_WIDTH = 768;
/** Lattice circumradius R_t on desktop — site area ≈ 36 px². */
const DESKTOP_HEX_RT = 3.75;
/** Lattice circumradius R_t on mobile (<768px) — site area ≈ 16 px². */
const MOBILE_HEX_RT = 2.5;
/** Visual radius R = 0.85 · R_t → ~15% shrink, a visible ~1px gap. */
const HEX_SHRINK = 0.85;
/** Fallback ambient RGB when `--pb-ambient` is missing or unparsable. */
const DEFAULT_AMBIENT: RGB = [21, 21, 23];
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const SQRT3 = Math.sqrt(3);
const SQRT3_2 = SQRT3 / 2;

// Ambient twinkle (uncolored cells only).
const AMBIENT_INITIAL_ALPHA = 10;
const AMBIENT_ACTIVE_ALPHA = 30;
const AMBIENT_IDLE_ALPHA = 10;
const TWINKLE_MAX_DELAY = 15000;
const TWINKLE_MIN_DURATION = 1000;
const TWINKLE_DURATION_SPAN = 5000;

// Pointer trail.
const POINTER_LERP = 0.15;
const POINTER_IDLE_MS = 350;
const BRUSH_FACTOR = 0.6;
const BRUSH_MIN_RADIUS = 30;
const BRUSH_MAX_RADIUS = 140;
const COLORIZE_CHANCE = 0.6;
const TRAIL_ALPHA_BASE = 25;
const TRAIL_ALPHA_SPAN = 230;

// Decay of colored cells.
const DECAY_RATE = 0.02;
const DECAY_RESET_ALPHA = 50;

// Loop robustness.
const MAX_FRAME_DELTA_MS = 100;
const RESIZE_DEBOUNCE_MS = 150;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// DT intro animation.
const DT_SHOW_DURATION_MS = 3000;
const DT_FADE_OUT_MS = 600;

/** Pattern for intro — empty by default. */
const INTRO_PATTERN: Array<[number, number]> = [];

interface Point {
  x: number;
  y: number;
}

/**
 * Owns the canvas, the grid state and the requestAnimationFrame loop.
 * Construct it, call `start()`, and call `dispose()` on teardown.
 */
export class PixelGrid {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly reducedMotion: boolean;

  private cells: PixelCell[] = [];
  private cols = 0;
  private rows = 0;
  /** Lattice circumradius R_t of one hexagon site. */
  private hexRt = 0;
  /** Visual circumradius R of a stamped hexagon. */
  private hexR = 0;
  /** X offsets of one hexagon's pixel stamp, relative to its center. */
  private stampDx: Int16Array = new Int16Array(0);
  /** Y offsets of one hexagon's pixel stamp, relative to its center. */
  private stampDy: Int16Array = new Int16Array(0);
  private stampCount = 0;
  /** Ambient (uncolored) RGB, read from the container's `--pb-ambient`. */
  private ambient: RGB = [...DEFAULT_AMBIENT];
  private width = 0;
  private height = 0;
  /** Assigned by `applySize()` during construction. */
  private imageData!: ImageData;
  /** Uint32Array view over the ImageData buffer for fast pixel writes. */
  private pixels!: Uint32Array;

  private readonly smoothed: Point = { x: 0, y: 0 };
  private target: Point | null = null;
  private radius = BRUSH_MIN_RADIUS;
  private lastInputAt = 0;
  private autonomous = true;
  private elapsed = 0;
  private lastTime = 0;

  private rafId: number | null = null;
  private resizeTimer: number | null = null;
  private observer: IntersectionObserver | null = null;
  private colorScheme: MediaQueryList | null = null;
  private themeObserver: MutationObserver | null = null;
  private pageVisible = true;
  private inViewport = true;
  private started = false;
  private destroyed = false;
  private showDTOverlay = true;
  private dtStartTime = 0;

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('PixelGrid: unable to acquire a 2D rendering context.');
    }
    this.context = context;
    this.reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    // Theme is read once here; it is only re-read on theme-change events.
    this.ambient = this.readAmbient();
    this.applySize();
    this.buildGrid();
  }

  /** Attach listeners and start animating (or paint one static frame). */
  public start(): void {
    if (this.started || this.destroyed) return;
    this.started = true;
    this.dtStartTime = Date.now();

    this.attachListeners();
    // Paint immediately so the grid never flashes blank.
    this.paint();

    if (this.reducedMotion) return;
    this.syncLoop();
  }

  /** Cancel the loop and remove every listener/observer. Safe to call twice. */
  public dispose(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = null;
    }

    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.colorScheme?.removeEventListener('change', this.onThemeChange);
    this.colorScheme = null;
    this.themeObserver?.disconnect();
    this.themeObserver = null;
    this.observer?.disconnect();
    this.observer = null;
  }

  // ---------------------------------------------------------------- setup

  /**
   * Read `--pb-ambient` from the container's computed style.
   * Accepts space- or comma-separated `r g b` triples; falls back to the
   * light-theme default when the value is missing or unparsable.
   */
  private readAmbient(): RGB {
    const raw = window.getComputedStyle(this.container).getPropertyValue('--pb-ambient');
    const parts = raw.trim().split(/[\s,]+/);
    if (parts.length >= 3) {
      const r = Number(parts[0]);
      const g = Number(parts[1]);
      const b = Number(parts[2]);
      if (
        Number.isFinite(r) &&
        Number.isFinite(g) &&
        Number.isFinite(b) &&
        r >= 0 &&
        r <= 255 &&
        g >= 0 &&
        g <= 255 &&
        b >= 0 &&
        b <= 255
      ) {
        return [Math.round(r), Math.round(g), Math.round(b)];
      }
    }
    return [...DEFAULT_AMBIENT];
  }

  /** Resize the canvas at CSS pixel resolution and refresh the buffers. */
  private applySize(): void {
    // Intentionally no devicePixelRatio scaling: chunky pixels are the look.
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.imageData = this.context.createImageData(this.width, this.height);
    this.pixels = new Uint32Array(this.imageData.data.buffer);

    this.smoothed.x = this.width * 0.5;
    this.smoothed.y = this.height * 0.5;
  }

  /**
   * Rebuild the cell grid from scratch (also runs on debounced resize).
   * Layout: gapless honeycomb of pointy-top hexagons with lattice radius
   * R_t — x-spacing √3·R_t, y-spacing 1.5·R_t, odd rows shifted +√3·R_t/2.
   */
  private buildGrid(): void {
    const mobile = window.innerWidth < DESKTOP_MIN_WIDTH;
    this.hexRt = mobile ? MOBILE_HEX_RT : DESKTOP_HEX_RT;
    this.hexR = HEX_SHRINK * this.hexRt;
    this.buildStamp();

    const xSpacing = SQRT3 * this.hexRt;
    const ySpacing = 1.5 * this.hexRt;
    // +2: one column for the odd-row half-step shift, one for edge stamps.
    this.cols = Math.ceil(this.width / xSpacing) + 2;
    this.rows = Math.ceil(this.height / ySpacing) + 2;

    const [ar, ag, ab] = this.ambient;
    const cells: PixelCell[] = new Array(this.cols * this.rows);
    for (let row = 0; row < this.rows; row++) {
      const shift = row % 2 === 1 ? xSpacing * 0.5 : 0;
      const cy = Math.round(row * ySpacing);
      for (let col = 0; col < this.cols; col++) {
        cells[row * this.cols + col] = {
          x: Math.round(col * xSpacing + shift),
          y: cy,
          delay: Math.random() * TWINKLE_MAX_DELAY,
          duration: Math.random() * TWINKLE_DURATION_SPAN + TWINKLE_MIN_DURATION,
          color: [ar, ag, ab, AMBIENT_INITIAL_ALPHA],
        };
      }
    }
    this.cells = cells;
  }

  /**
   * Precompute the pixel coverage of ONE hexagon as integer {dx, dy}
   * offsets from its (integer) center. Pixel CENTERS (x+0.5, y+0.5) are
   * tested against the pointy-top inside test, so the stamp is symmetric
   * about both axes and is never the full bounding rectangle.
   */
  private buildStamp(): void {
    const halfWidth = SQRT3_2 * this.hexR;
    const minX = Math.ceil(-halfWidth - 0.5);
    const maxX = Math.floor(halfWidth - 0.5);
    const minY = Math.ceil(-this.hexR - 0.5);
    const maxY = Math.floor(this.hexR - 0.5);

    const dx: number[] = [];
    const dy: number[] = [];
    for (let iy = minY; iy <= maxY; iy++) {
      const py = iy + 0.5;
      for (let ix = minX; ix <= maxX; ix++) {
        const px = ix + 0.5;
        if (Math.abs(px) > halfWidth) continue;
        if (Math.abs(0.5 * px + SQRT3_2 * py) > halfWidth) continue;
        if (Math.abs(-0.5 * px + SQRT3_2 * py) > halfWidth) continue;
        dx.push(ix);
        dy.push(iy);
      }
    }

    this.stampDx = Int16Array.from(dx);
    this.stampDy = Int16Array.from(dy);
    this.stampCount = dx.length;
  }

  private attachListeners(): void {
    window.addEventListener('mousemove', this.onMouseMove);
    // preventDefault() on touchstart requires a non-passive listener.
    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    // Theme: system color-scheme flips …
    this.colorScheme = window.matchMedia(COLOR_SCHEME_QUERY);
    this.colorScheme.addEventListener('change', this.onThemeChange);
    // … plus runtime `html.dark` / `html.light` class toggles.
    if (typeof MutationObserver !== 'undefined') {
      this.themeObserver = new MutationObserver(this.onThemeChange);
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(this.onIntersect);
      this.observer.observe(this.container);
    }
  }

  // -------------------------------------------------------------- pointer

  private handlePointer(x: number, y: number): void {
    // First real input permanently disables autonomous motion.
    this.autonomous = false;
    this.target = { x, y };
    this.lastInputAt = this.elapsed;
  }

  private readonly onMouseMove = (event: MouseEvent): void => {
    this.handlePointer(event.pageX, event.pageY);
  };

  private readonly onTouchStart = (event: TouchEvent): void => {
    event.preventDefault();
    const touch = event.touches[0];
    if (touch) this.handlePointer(touch.pageX, touch.pageY);
  };

  private readonly onTouchMove = (event: TouchEvent): void => {
    const touch = event.touches[0];
    if (touch) this.handlePointer(touch.pageX, touch.pageY);
  };

  /** Update the target (real or autonomous), smoothing and brush radius. */
  private updatePointer(): void {
    if (this.autonomous) {
      const t = this.elapsed / 1000;
      const w = this.width;
      const h = this.height;
      this.target = {
        x: w * 0.5 + Math.cos(t * 2.1) * Math.cos(t * 0.8) * w * 0.5,
        y: h * 0.5 + Math.sin(t * 3.1) * Math.tan(Math.sin(t * 0.8)) * h * 0.5,
      };
      this.lastInputAt = this.elapsed;
    } else if (this.target !== null && this.elapsed - this.lastInputAt > POINTER_IDLE_MS) {
      this.target = null;
    }

    const target = this.target;
    if (target === null) return;

    this.smoothed.x += (target.x - this.smoothed.x) * POINTER_LERP;
    this.smoothed.y += (target.y - this.smoothed.y) * POINTER_LERP;

    const dx = this.smoothed.x - target.x;
    const dy = this.smoothed.y - target.y;
    const distance = Math.hypot(dx, dy) * BRUSH_FACTOR;
    this.radius = Math.min(Math.max(distance, BRUSH_MIN_RADIUS), BRUSH_MAX_RADIUS);
  }

  // --------------------------------------------------------------- system

  private readonly onResize = (): void => {
    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = window.setTimeout(() => {
      this.resizeTimer = null;
      if (this.destroyed) return;
      this.applySize();
      this.buildGrid();
      this.paint();
    }, RESIZE_DEBOUNCE_MS);
  };

  private readonly onVisibilityChange = (): void => {
    this.pageVisible = document.visibilityState !== 'hidden';
    this.syncLoop();
  };

  private readonly onIntersect = (entries: IntersectionObserverEntry[]): void => {
    const entry = entries[0];
    if (entry) this.inViewport = entry.isIntersecting;
    this.syncLoop();
  };

  /**
   * Theme changed (system color scheme or html.dark/html.light toggle):
   * re-read `--pb-ambient` once and repaint. Nothing else restarts — cells
   * still holding the old ambient rgb miss the ambient test, take the
   * decay branch and reset to the NEW ambient on this very paint.
   */
  private readonly onThemeChange = (): void => {
    if (this.destroyed) return;
    this.ambient = this.readAmbient();
    this.paint();
  };

  private shouldAnimate(): boolean {
    return !this.destroyed && !this.reducedMotion && this.pageVisible && this.inViewport;
  }

  /** Start the RAF loop when allowed, cancel it when not. */
  private syncLoop(): void {
    if (this.shouldAnimate()) {
      if (this.rafId === null) {
        this.lastTime = 0;
        this.rafId = window.requestAnimationFrame(this.frame);
      }
    } else if (this.rafId !== null) {
      window.cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private readonly frame = (now: number): void => {
    this.rafId = null;
    if (!this.shouldAnimate()) return;

    // Clamp delta time so resuming from a background tab cannot jump.
    const delta = this.lastTime === 0 ? 0 : Math.min(Math.max(now - this.lastTime, 0), MAX_FRAME_DELTA_MS);
    this.lastTime = now;
    this.elapsed += delta;

    this.updatePointer();
    this.paint();

    this.rafId = window.requestAnimationFrame(this.frame);
  };

  /** Check if a cell (by col, row) is part of the intro pattern. */
  private isDTCell(col: number, row: number): boolean {
    return INTRO_PATTERN.some(([c, r]) => c === col && r === row);
  }

  /** Get the alpha for the DT overlay based on elapsed time. */
  private getDTAlpha(): number {
    const elapsed = Date.now() - this.dtStartTime;
    if (elapsed < DT_SHOW_DURATION_MS) {
      return 1; // Fully opaque while showing
    }
    const fadeElapsed = elapsed - DT_SHOW_DURATION_MS;
    if (fadeElapsed < DT_FADE_OUT_MS) {
      return 1 - fadeElapsed / DT_FADE_OUT_MS; // Fade out
    }
    this.showDTOverlay = false;
    return 0; // Hidden
  }

  // -------------------------------------------------------------- painting

  /** Alpha of an ambient (uncolored) cell for the given moment of its cycle. */
  private ambientAlpha(cell: PixelCell): number {
    const cycle = cell.delay + cell.duration;
    const phase = (this.elapsed + cell.delay) % cycle;
    return phase < cell.duration ? AMBIENT_ACTIVE_ALPHA : AMBIENT_IDLE_ALPHA;
  }

  /**
   * Write every hexagon cell's precomputed pixel stamp into the buffer as
   * packed 32-bit RGBA and flush the whole frame with a single
   * putImageData() call. Untouched pixels stay transparent so the
   * page/container provides the themed base color.
   */
  private paint(): void {
    const { cells, cols, rows, width, height, pixels, smoothed, target, ambient, stampDx, stampDy, stampCount } = this;
    pixels.fill(0);

    const [ambientR, ambientG, ambientB] = ambient;
    const painting = target !== null;
    const radiusSq = this.radius * this.radius;

    // Calculate DT overlay state
    let dtAlpha = 0;
    if (this.showDTOverlay) {
      dtAlpha = this.getDTAlpha();
    }

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cell = cells[row * cols + col];
        const color = cell.color;

        // Check if this cell is part of the DT pattern and overlay is active
        if (this.showDTOverlay && dtAlpha > 0 && this.isDTCell(col, row)) {
          // DT cell: use a bright color with alpha based on overlay state
          const dtColor = PALETTE[0]; // Use first palette color for DT
          color[0] = dtColor[0];
          color[1] = dtColor[1];
          color[2] = dtColor[2];
          color[3] = Math.round(255 * dtAlpha * 0.8); // 80% of full alpha
        } else if (color[0] === ambientR && color[1] === ambientG && color[2] === ambientB) {
          // Ambient cell: twinkle alpha, then maybe colorize it.
          color[3] = this.ambientAlpha(cell);
          if (painting) {
            const dx = cell.x - smoothed.x;
            const dy = cell.y - smoothed.y;
            if (dx * dx + dy * dy <= radiusSq && Math.random() < COLORIZE_CHANCE) {
              const picked = PALETTE[(Math.random() * PALETTE.length) | 0];
              color[0] = picked[0];
              color[1] = picked[1];
              color[2] = picked[2];
              color[3] = TRAIL_ALPHA_BASE + TRAIL_ALPHA_SPAN * Math.random();
            }
          }
        } else {
          // Colored (or stale-ambient) cell: exponential decay, then reset
          // to the current ambient rgb. Stale ambient cells have alpha ≤ 50
          // already, so a theme change self-heals on this very paint.
          const next = color[3] - color[3] * DECAY_RATE;
          if (next <= DECAY_RESET_ALPHA) {
            color[0] = ambientR;
            color[1] = ambientG;
            color[2] = ambientB;
            color[3] = this.ambientAlpha(cell);
          } else {
            color[3] = next;
          }
        }

        // Packed little-endian RGBA: (a << 24) | (b << 16) | (g << 8) | r.
        const packed = ((color[3] | 0) << 24) | (color[2] << 16) | (color[1] << 8) | color[0];
        const cx = cell.x;
        const cy = cell.y;

        for (let i = 0; i < stampCount; i++) {
          const px = cx + stampDx[i];
          if (px < 0 || px >= width) continue;
          const py = cy + stampDy[i];
          if (py < 0 || py >= height) continue;
          pixels[py * width + px] = packed;
        }
      }
    }

    this.context.putImageData(this.imageData, 0, 0);
  }
}
