/**
 * BackdropGuides — the drafting cursor over the living system diagram.
 *
 * A horizontal guide follows the scroll progress, a vertical guide follows the
 * pointer, and a click leaves an expanding ring in the same material as the
 * schematic's node flashes. It runs on its own overlay canvas above the page
 * sections and never touches the schematic engine.
 */

export type RGB = readonly [number, number, number];

interface ClickRing {
  x: number;
  y: number;
  born: number;
}

const DPR_CAP = 2;
const CLICK_LIFE_MS = 1100;
const CLICK_MAX = 6;
const SCROLL_HOLD_MS = 900;
const SCROLL_FADE_MS = 600;
const RESIZE_DEBOUNCE_MS = 140;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

const DEFAULT_INK: RGB = [255, 255, 255];
const DEFAULT_ACCENT: RGB = [196, 16, 29];

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

function rgbToCss(color: RGB): string {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

export class BackdropGuides {
  private readonly colorSource: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private width = 0;
  private height = 0;
  private dpr = 1;

  private inkCss = rgbToCss(DEFAULT_INK);
  private accentCss = rgbToCss(DEFAULT_ACCENT);

  private pointerX = 0;
  private pointerY = 0;
  private pointerVisible = false;

  private scrollProgress = 0;
  private lastScrollAt = 0;

  private clickRings: ClickRing[] = [];

  private reducedMotion = false;
  private pageVisible = true;
  private started = false;
  private destroyed = false;

  private rafId: number | null = null;
  private resizeTimer: number | null = null;
  private motionQuery: MediaQueryList | null = null;
  private colorQuery: MediaQueryList | null = null;
  private themeObserver: MutationObserver | null = null;

  constructor(colorSource: HTMLElement, canvas: HTMLCanvasElement) {
    this.colorSource = colorSource;
    this.canvas = canvas;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('BackdropGuides: unable to acquire a 2D rendering context.');
    }
    this.context = context;
    this.reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;

    this.readColors();
    this.layout();
  }

  public start(): void {
    if (this.started || this.destroyed) return;
    this.started = true;
    this.attachListeners();
    this.requestPaint();
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

    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.motionQuery?.removeEventListener('change', this.onMotionPreference);
    this.colorQuery?.removeEventListener('change', this.onThemeChange);
    this.motionQuery = null;
    this.colorQuery = null;
    this.themeObserver?.disconnect();
    this.themeObserver = null;
  }

  // ---------------------------------------------------------------- geometry

  private readColors(): void {
    this.inkCss = rgbToCss(this.readColor('--pb-ink', DEFAULT_INK));
    this.accentCss = rgbToCss(this.readColor('--pb-accent', DEFAULT_ACCENT));
  }

  private readColor(property: string, fallback: RGB): RGB {
    const raw = window.getComputedStyle(this.colorSource).getPropertyValue(property).trim();
    const parts = raw.split(/[\s,]+/);
    if (parts.length < 3) return fallback;

    const r = Number(parts[0]);
    const g = Number(parts[1]);
    const b = Number(parts[2]);
    const valid = (value: number) => Number.isFinite(value) && value >= 0 && value <= 255;
    if (!valid(r) || !valid(g) || !valid(b)) return fallback;

    return [Math.round(r), Math.round(g), Math.round(b)];
  }

  private layout(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

    this.canvas.width = Math.round(width * this.dpr);
    this.canvas.height = Math.round(height * this.dpr);
    this.context.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  // ---------------------------------------------------------------- motion

  private scrollAlpha(now: number): number {
    if (this.scrollProgress <= 0 || this.lastScrollAt === 0) return 0;
    const idle = now - this.lastScrollAt;
    if (idle <= SCROLL_HOLD_MS) return 1;
    return clamp(1 - (idle - SCROLL_HOLD_MS) / SCROLL_FADE_MS, 0, 1);
  }

  private needsAnimation(now: number): boolean {
    return this.clickRings.length > 0 || this.scrollAlpha(now) > 0;
  }

  private requestPaint(): void {
    if (this.destroyed || !this.pageVisible) return;
    if (this.rafId === null) {
      this.rafId = window.requestAnimationFrame(this.tick);
    }
  }

  private readonly tick = (now: number): void => {
    this.rafId = null;
    if (this.destroyed) return;

    this.paint(now);

    if (this.pageVisible && this.needsAnimation(now)) {
      this.rafId = window.requestAnimationFrame(this.tick);
    }
  };

  // ---------------------------------------------------------------- render

  private paint(now: number): void {
    const ctx = this.context;
    const width = this.width;
    const height = this.height;

    ctx.clearRect(0, 0, width, height);
    if (width === 0 || height === 0) return;

    ctx.lineCap = 'butt';

    const scrollAlpha = this.scrollAlpha(now);
    if (scrollAlpha > 0) this.paintScrollLine(scrollAlpha);

    if (this.pointerVisible) this.paintPointerLine();

    if (this.clickRings.length > 0) this.paintClickRings(now);

    ctx.globalAlpha = 1;
  }

  private paintScrollLine(alpha: number): void {
    const ctx = this.context;
    const y = (0.08 + 0.84 * this.scrollProgress) * this.height;

    const gradient = ctx.createLinearGradient(0, 0, this.width, 0);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.12, this.inkCss);
    gradient.addColorStop(0.88, this.inkCss);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalAlpha = alpha * 0.22;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(this.width, y);
    ctx.stroke();

    // End ticks, like a dimension line.
    ctx.globalAlpha = alpha * 0.4;
    ctx.strokeStyle = this.inkCss;
    ctx.beginPath();
    ctx.moveTo(this.width * 0.12, y - 4);
    ctx.lineTo(this.width * 0.12, y + 4);
    ctx.moveTo(this.width * 0.88, y - 4);
    ctx.lineTo(this.width * 0.88, y + 4);
    ctx.stroke();

    // Accent node where the guide crosses the bus column.
    const busX = this.width < 768 ? this.width * 0.86 : this.width * 0.82;
    ctx.globalAlpha = alpha * 0.65;
    ctx.fillStyle = this.accentCss;
    ctx.fillRect(busX - 1.5, y - 1.5, 3, 3);
  }

  private paintPointerLine(): void {
    const ctx = this.context;
    const x = this.pointerX;

    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(0.1, this.inkCss);
    gradient.addColorStop(0.9, this.inkCss);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');

    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.height);
    ctx.stroke();

    // Short horizontal tick at the pointer height.
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = this.inkCss;
    ctx.beginPath();
    ctx.moveTo(x - 7, this.pointerY);
    ctx.lineTo(x + 7, this.pointerY);
    ctx.stroke();
  }

  private paintClickRings(now: number): void {
    const ctx = this.context;

    for (let i = this.clickRings.length - 1; i >= 0; i -= 1) {
      const ring = this.clickRings[i];
      const progress = (now - ring.born) / CLICK_LIFE_MS;
      if (progress >= 1) {
        this.clickRings.splice(i, 1);
        continue;
      }

      const eased = this.reducedMotion ? 0.55 : 1 - Math.pow(1 - progress, 3);
      const radius = 4 + eased * 44;

      ctx.globalAlpha = (1 - progress) * (1 - progress) * 0.55;
      ctx.strokeStyle = this.accentCss;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = (1 - progress) * 0.75;
      ctx.fillStyle = this.inkCss;
      ctx.fillRect(ring.x - 1.5, ring.y - 1.5, 3, 3);
    }
  }

  // ---------------------------------------------------------------- listeners

  private attachListeners(): void {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('scroll', this.onScroll, { passive: true });
    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    this.motionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
    this.motionQuery.addEventListener('change', this.onMotionPreference);

    this.colorQuery = window.matchMedia(COLOR_SCHEME_QUERY);
    this.colorQuery.addEventListener('change', this.onThemeChange);

    if (typeof MutationObserver !== 'undefined') {
      this.themeObserver = new MutationObserver(this.onThemeChange);
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.destroyed) return;
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    this.pointerVisible = true;
    this.requestPaint();
  };

  private readonly onPointerLeave = (): void => {
    if (this.destroyed) return;
    this.pointerVisible = false;
    this.requestPaint();
  };

  private readonly onPointerDown = (event: PointerEvent): void => {
    if (this.destroyed) return;
    this.addClickRing(event.clientX, event.clientY);
    this.requestPaint();
  };

  private readonly onScroll = (): void => {
    if (this.destroyed) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrollProgress = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    this.lastScrollAt = performance.now();
    this.requestPaint();
  };

  private readonly onResize = (): void => {
    if (this.resizeTimer !== null) {
      window.clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = window.setTimeout(() => {
      this.resizeTimer = null;
      if (this.destroyed) return;
      this.readColors();
      this.layout();
      this.requestPaint();
    }, RESIZE_DEBOUNCE_MS);
  };

  private readonly onVisibilityChange = (): void => {
    this.pageVisible = document.visibilityState !== 'hidden';
    if (!this.pageVisible) {
      if (this.rafId !== null) {
        window.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } else {
      this.requestPaint();
    }
  };

  private readonly onMotionPreference = (event: MediaQueryListEvent): void => {
    if (this.destroyed) return;
    this.reducedMotion = event.matches;
    this.requestPaint();
  };

  private readonly onThemeChange = (): void => {
    if (this.destroyed) return;
    this.readColors();
    this.requestPaint();
  };

  private addClickRing(x: number, y: number): void {
    this.clickRings.push({ x, y, born: performance.now() });
    if (this.clickRings.length > CLICK_MAX) this.clickRings.shift();
  }
}
