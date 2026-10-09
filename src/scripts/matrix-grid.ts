/**
 * MatrixGrid — Canvas-based ASCII Matrix rain effect with color trails.
 * Characters fall from top to bottom like rain, creating a dynamic background.
 */

export type RGBA = [number, number, number, number];
export type RGB = [number, number, number];

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  char: string;
  nextCharTime: number;
  trailLength: number;
  headAlpha: number;
}

// ASCII characters pool
const ASCII_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Color palette for trails
const PALETTE: ReadonlyArray<readonly [number, number, number]> = [
  [26, 188, 156],   // turquoise
  [46, 204, 113],   // green
  [52, 152, 219],   // blue
  [155, 89, 182],   // purple
  [241, 196, 15],   // yellow
  [230, 126, 34],   // orange
  [231, 76, 60],    // red
];

const DEFAULT_AMBIENT: RGB = [21, 21, 23];
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

// Timing and animation
const CHAR_CHANGE_INTERVAL = 150; // milliseconds
const DECAY_RATE = 0.02;
const DECAY_RESET_ALPHA = 30;
const TRAIL_ALPHA_BASE = 60;
const TRAIL_ALPHA_SPAN = 180;
const MAX_FRAME_DELTA_MS = 100;
const RESIZE_DEBOUNCE_MS = 150;

// Pointer interaction
const POINTER_LERP = 0.15;
const POINTER_IDLE_MS = 350;
const BRUSH_FACTOR = 0.8;
const BRUSH_MIN_RADIUS = 20;
const BRUSH_MAX_RADIUS = 80;
const COLORIZE_CHANCE = 0.6;

interface Point {
  x: number;
  y: number;
}

interface MatrixCell {
  char: string;
  color: RGBA;
}

export class MatrixGrid {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;
  private readonly reducedMotion: boolean;

  private columns: MatrixColumn[] = [];
  private grid: MatrixCell[] = [];
  private cols = 0;
  private rows = 0;
  private charWidth = 0;
  private charHeight = 0;
  private ambient: RGB = [...DEFAULT_AMBIENT];
  private width = 0;
  private height = 0;

  private font = '14px monospace';
  private smoothed: Point = { x: 0, y: 0 };
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

  constructor(container: HTMLElement, canvas: HTMLCanvasElement) {
    this.container = container;
    this.canvas = canvas;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('MatrixGrid: unable to acquire a 2D rendering context.');
    }
    this.context = context;
    this.reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    this.ambient = this.readAmbient();
    this.applySize();
    this.buildGrid();
  }

  public start(): void {
    if (this.started || this.destroyed) return;
    this.started = true;

    this.attachListeners();
    this.paint();

    if (this.reducedMotion) return;
    this.syncLoop();
  }

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
    window.removeEventListener('touchstart', this.onTouchStart, { passive: true } as EventListenerOptions);
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

  private applySize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.smoothed.x = this.width * 0.5;
    this.smoothed.y = this.height * 0.5;
  }

  private buildGrid(): void {
    // Measure character dimensions
    this.context.font = this.font;
    const metrics = this.context.measureText('M');
    this.charWidth = Math.ceil(metrics.width) * 0.85; // Reduce spacing para más densidad
    this.charHeight = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent) * 0.9;

    this.cols = Math.ceil(this.width / this.charWidth) + 1;
    this.rows = Math.ceil(this.height / this.charHeight) + 1;

    // Initialize grid
    const grid: MatrixCell[] = new Array(this.cols * this.rows);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = { char: ' ', color: [...this.ambient, 0] };
    }
    this.grid = grid;

    // Create columns for rain effect - increase density
    const columns: MatrixColumn[] = [];
    for (let col = 0; col < this.cols; col++) {
      // Stagger the starting positions
      const offset = Math.floor(col / 3); // Create multiple rain streams
      columns.push({
        x: col * this.charWidth,
        y: (Math.random() * this.height - this.charHeight) + (offset * this.charHeight),
        speed: 0.5 + Math.random() * 2.5,
        char: this.getRandomChar(),
        nextCharTime: this.elapsed + CHAR_CHANGE_INTERVAL,
        trailLength: 8 + Math.floor(Math.random() * 18),
        headAlpha: 200,
      });
    }
    this.columns = columns;
  }

  private getRandomChar(): string {
    return ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
  }

  private attachListeners(): void {
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('touchstart', this.onTouchStart, { passive: true } as EventListenerOptions);
    window.addEventListener('touchmove', this.onTouchMove);
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.colorScheme = window.matchMedia(COLOR_SCHEME_QUERY);
    this.colorScheme.addEventListener('change', this.onThemeChange);

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

  private handlePointer(x: number, y: number): void {
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

  private readonly onThemeChange = (): void => {
    if (this.destroyed) return;
    this.ambient = this.readAmbient();
    this.paint();
  };

  private shouldAnimate(): boolean {
    return !this.destroyed && !this.reducedMotion && this.pageVisible && this.inViewport;
  }

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

    const delta = this.lastTime === 0 ? 0 : Math.min(Math.max(now - this.lastTime, 0), MAX_FRAME_DELTA_MS);
    this.lastTime = now;
    this.elapsed += delta;

    this.updatePointer();
    this.paint();

    this.rafId = window.requestAnimationFrame(this.frame);
  };

  private paint(): void {
    const { width, height, smoothed, target, ambient, charWidth, charHeight, columns, grid, cols, rows } = this;

    // Clear canvas con transparencia (no fondo sólido)
    this.context.clearRect(0, 0, width, height);

    const [ambientR, ambientG, ambientB] = ambient;
    const painting = target !== null;
    const radiusSq = this.radius * this.radius;

    this.context.font = this.font;

    // Reset grid
    for (let i = 0; i < grid.length; i++) {
      grid[i].char = ' ';
      grid[i].color[3] = 0;
    }

    // Update columns and populate grid
    for (const col of columns) {
      // Update character periodically
      if (this.elapsed >= col.nextCharTime) {
        col.char = this.getRandomChar();
        col.nextCharTime = this.elapsed + CHAR_CHANGE_INTERVAL;
      }

      // Move column down
      col.y += col.speed;

      // Reset if off screen
      if (col.y > height) {
        col.y = -this.charHeight;
      }

      // Draw trail
      const colIndex = Math.floor(col.x / charWidth);
      for (let i = 0; i < col.trailLength; i++) {
        const trailY = col.y - i * charHeight;
        const rowIndex = Math.floor(trailY / charHeight);

        if (rowIndex >= 0 && rowIndex < rows && colIndex >= 0 && colIndex < cols) {
          const cellIndex = rowIndex * cols + colIndex;
          if (cellIndex < grid.length) {
            const alpha = 255 * (1 - i / col.trailLength);
            grid[cellIndex].char = i === 0 ? col.char : ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
            grid[cellIndex].color = [ambientR, ambientG, ambientB, alpha];
          }
        }
      }
    }

    // Apply mouse colorization
    if (painting) {
      for (let i = 0; i < grid.length; i++) {
        if (grid[i].color[3] === 0) continue;

        const cellCol = i % cols;
        const cellRow = Math.floor(i / cols);
        const cellX = cellCol * charWidth + charWidth * 0.5;
        const cellY = cellRow * charHeight + charHeight * 0.5;

        const dx = cellX - smoothed.x;
        const dy = cellY - smoothed.y;

        if (dx * dx + dy * dy <= radiusSq && Math.random() < COLORIZE_CHANCE) {
          const picked = PALETTE[Math.floor(Math.random() * PALETTE.length)];
          grid[i].color[0] = picked[0];
          grid[i].color[1] = picked[1];
          grid[i].color[2] = picked[2];
        }
      }
    }

    // Render grid
    for (let i = 0; i < grid.length; i++) {
      const cell = grid[i];
      if (cell.color[3] === 0 || cell.char === ' ') continue;

      const cellCol = i % cols;
      const cellRow = Math.floor(i / cols);
      const x = cellCol * charWidth;
      const y = cellRow * charHeight + charHeight * 0.75;

      const alpha = cell.color[3] / 255;
      this.context.fillStyle = `rgba(${cell.color[0]}, ${cell.color[1]}, ${cell.color[2]}, ${alpha})`;
      this.context.fillText(cell.char, x, y);
    }
  }
}
