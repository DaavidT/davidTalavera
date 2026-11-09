/**
 * BackdropSchematic — the portfolio's living system diagram.
 *
 * An orthogonal bus runs down the right of the viewport with branches, taps, and
 * terminal nodes. On first paint the bus energises from the top and every branch
 * grows as the bus reaches it; afterwards signal packets run the routes and flare
 * their terminals. The pointer probes the diagram: the nearest node flares and
 * the whole network lifts a little. Motion stops when the tab is hidden and
 * collapses to a single static frame when the visitor prefers reduced motion.
 */

export type RGB = readonly [number, number, number];

interface Segment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  /** Cumulative distance at the segment start. */
  d0: number;
}

interface Route {
  segments: Segment[];
  length: number;
  /** Index of the route this one departs from, or -1 for the main bus. */
  parent: number;
  /** Distance along the parent where this route departs. */
  attach: number;
  terminalX: number;
  terminalY: number;
}

interface Packet {
  route: number;
  /** 0..1 along its route. */
  t: number;
  /** Pixels per second. */
  speed: number;
  accent: boolean;
  /** Seconds to hold before the next departure. */
  wait: number;
}

interface Flash {
  x: number;
  y: number;
  born: number;
  accent: boolean;
}

interface Node {
  x: number;
  y: number;
}

const DPR_CAP = 2;
const MAX_FRAME_MS = 64;
const RESIZE_DEBOUNCE_MS = 140;

const INTRO_MS = 1700;
const GROWTH_PX = 150;

const PACKET_MIN = 6;
const PACKET_MAX = 12;

const FLASH_LIFE_MS = 900;
const FLASH_MAX = 8;

const PROBE_RADIUS = 170;
const PROBE_IDLE_MS = 2200;

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

const DEFAULT_INK: RGB = [255, 255, 255];
const DEFAULT_ACCENT: RGB = [196, 16, 29];

function clamp(value: number, min: number, max: number): number {
  return value < min ? min : value > max ? max : value;
}

/** Stable 0..1 noise so the diagram is designed, not re-rolled per resize. */
function noise(seed: number): number {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function rgbToCss(color: RGB): string {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}

function buildRoute(
  points: ReadonlyArray<readonly [number, number]>,
  parent: number,
  attach: number,
): Route {
  const segments: Segment[] = [];
  let distance = 0;

  for (let i = 1; i < points.length; i += 1) {
    const from = points[i - 1];
    const to = points[i];
    segments.push({ x1: from[0], y1: from[1], x2: to[0], y2: to[1], d0: distance });
    distance += Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);
  }

  const end = points[points.length - 1];
  return {
    segments,
    length: distance,
    parent,
    attach,
    terminalX: end[0],
    terminalY: end[1],
  };
}

export class BackdropSchematic {
  private readonly container: HTMLElement;
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  private routes: Route[] = [];
  private packetRoutes: number[] = [];
  private packets: Packet[] = [];
  private flashes: Flash[] = [];
  private nodes: Node[] = [];
  private visible: number[] = [];
  private dimension = { x: 0, top: 0, bottom: 0, levels: [] as number[] };

  private width = 0;
  private height = 0;
  private dpr = 1;

  private inkCss = rgbToCss(DEFAULT_INK);
  private accentCss = rgbToCss(DEFAULT_ACCENT);

  private elapsed = 0;
  private lastFrame = 0;

  private pointerPresence = 0;
  private pointerX = 0;
  private pointerY = 0;
  private lastPointerMove = 0;
  private lastProbedNode = -1;
  private lastProbeAt = 0;

  private reducedMotion = false;
  private staticFrame = false;

  private rafId: number | null = null;
  private resizeTimer: number | null = null;
  private observer: IntersectionObserver | null = null;
  private motionQuery: MediaQueryList | null = null;
  private colorQuery: MediaQueryList | null = null;
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
      throw new Error('BackdropSchematic: unable to acquire a 2D rendering context.');
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

    if (this.reducedMotion) {
      this.paintStatic();
      return;
    }
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

    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.motionQuery?.removeEventListener('change', this.onMotionPreference);
    this.colorQuery?.removeEventListener('change', this.onThemeChange);
    this.motionQuery = null;
    this.colorQuery = null;
    this.themeObserver?.disconnect();
    this.themeObserver = null;
    this.observer?.disconnect();
    this.observer = null;
  }

  // ---------------------------------------------------------------- geometry

  private readColors(): void {
    this.inkCss = rgbToCss(this.readColor('--pb-ink', DEFAULT_INK));
    this.accentCss = rgbToCss(this.readColor('--pb-accent', DEFAULT_ACCENT));
  }

  private readColor(property: string, fallback: RGB): RGB {
    const raw = window.getComputedStyle(this.container).getPropertyValue(property).trim();
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

    const compact = width < 768;
    const busX = compact ? width * 0.86 : width * 0.82;
    const topY = height * (compact ? 0.44 : 0.07);
    const bottomY = height * (compact ? 1.04 : 0.92);
    const span = bottomY - topY;

    const routes: Route[] = [
      buildRoute(
        [
          [busX, topY],
          [busX, bottomY],
        ],
        -1,
        0,
      ),
    ];
    const nodes: Node[] = [];

    const trunkY = height * 0.62;
    const branchCount = compact ? 3 : 9;
    let leftMost = busX;

    for (let i = 0; i < branchCount; i += 1) {
      const jitter = (noise(i * 3.1 + 2) - 0.5) * 0.6;
      const fraction = clamp((i + 0.5 + jitter) / branchCount, 0.03, 0.93);
      const y = topY + span * fraction;

      // The trunk owns the mid band; keep branches clear of it.
      if (!compact && Math.abs(y - trunkY) < height * 0.055) continue;

      const toRight = !compact && i % 4 === 3;
      const reach = compact
        ? width * (0.16 + noise(i + 7) * 0.1)
        : toRight
          ? width * (0.05 + noise(i + 7) * 0.07)
          : width * (0.1 + noise(i + 7) * 0.2);
      const endX = clamp(busX + (toRight ? reach : -reach), 0, width);
      if (!toRight) leftMost = Math.min(leftMost, endX);
      const drop = (noise(i + 31) - 0.5) * height * 0.05;

      const points: Array<[number, number]> = [
        [busX, y],
        [endX, y],
      ];
      if (Math.abs(drop) > 8) points.push([endX, y + drop]);

      const branchIndex = routes.length;
      const branch = buildRoute(points, 0, y - topY);
      routes.push(branch);
      nodes.push({ x: endX, y: branch.terminalY });

      // Taps leave the run at a right angle; longer runs carry two.
      const tapCount = noise(i + 53) > 0.4 ? (reach > width * 0.18 ? 2 : 1) : 0;
      for (let t = 0; t < tapCount; t += 1) {
        const drop = 0.34 + t * 0.34 + noise(i + 11 + t) * 0.22;
        const tapX = busX + (endX - busX) * drop;
        const tapDrop =
          (height * 0.02 + noise(i + 23 + t) * height * 0.03) * (noise(i + 17 + t) > 0.5 ? -1 : 1);
        const tapTop = clamp(y + tapDrop, topY, bottomY);
        routes.push(
          buildRoute(
            [
              [tapX, y],
              [tapX, tapTop],
            ],
            branchIndex,
            Math.abs(tapX - busX),
          ),
        );
        nodes.push({ x: tapX, y: tapTop });
      }
    }

    if (!compact) {
      const trunkEndX = width * 0.575;
      const trunkIndex = routes.length;
      routes.push(
        buildRoute(
          [
            [busX, trunkY],
            [trunkEndX, trunkY],
          ],
          0,
          trunkY - topY,
        ),
      );

      for (let k = 0; k < 3; k += 1) {
        const x = trunkEndX + (busX - trunkEndX) * (0.18 + k * 0.28);
        const up = k % 2 === 0;
        const drop = (height * 0.05 + noise(k + 61) * height * 0.05) * (up ? -1 : 1);
        routes.push(
          buildRoute(
            [
              [x, trunkY],
              [x, clamp(trunkY + drop, topY, bottomY)],
            ],
            trunkIndex,
            Math.abs(x - busX),
          ),
        );
        nodes.push({ x, y: clamp(trunkY + drop, topY, bottomY) });
      }
    }

    // A dimension line measures the elevation, drawn left of the structure.
    const levels: number[] = [];
    for (let i = 0; i < routes.length; i += 1) {
      const route = routes[i];
      if (route.parent === 0) levels.push(route.segments[0].y1);
    }
    if (compact || levels.length === 0) {
      this.dimension = { x: 0, top: 0, bottom: 0, levels: [] };
    } else {
      const top = Math.min(...levels);
      const bottom = Math.max(...levels);
      this.dimension = {
        x: Math.max(width * 0.36, leftMost - 30),
        top: top - 12,
        bottom: bottom + 12,
        levels,
      };
    }

    this.routes = routes;
    this.nodes = nodes;
    this.visible = new Array(routes.length).fill(0);

    this.packetRoutes = [0];
    for (let i = 1; i < routes.length; i += 1) {
      if (routes[i].parent === 0 && routes[i].length > 70) this.packetRoutes.push(i);
    }

    const packetCount = clamp(Math.round(width / 170), PACKET_MIN, PACKET_MAX);
    const packets: Packet[] = [];
    for (let i = 0; i < packetCount; i += 1) {
      packets.push(this.spawnPacket(i / packetCount));
    }
    this.packets = packets;
    this.flashes = [];
  }

  private spawnPacket(t = -1): Packet {
    const route = this.packetRoutes[Math.floor(Math.random() * this.packetRoutes.length)] ?? 0;
    return {
      route,
      t: t < 0 ? 0 : t,
      speed: 110 + Math.random() * 120,
      accent: Math.random() < 0.28,
      wait: 0,
    };
  }

  private pickRoute(): number {
    const routes = this.packetRoutes;
    if (routes.length === 0) return 0;
    return routes[Math.floor(Math.random() * routes.length)];
  }

  // ---------------------------------------------------------------- motion

  private addFlash(x: number, y: number, accent: boolean): void {
    this.flashes.push({ x, y, born: this.elapsed, accent });
    if (this.flashes.length > FLASH_MAX) this.flashes.shift();
  }

  private probeNode(): void {
    if (this.pointerPresence <= 0) return;
    if (this.elapsed - this.lastProbeAt < 110) return;

    let best = -1;
    let bestDistance = PROBE_RADIUS * PROBE_RADIUS;
    for (let i = 0; i < this.nodes.length; i += 1) {
      const node = this.nodes[i];
      const dx = node.x - this.pointerX;
      const dy = node.y - this.pointerY;
      const distance = dx * dx + dy * dy;
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    }

    if (best < 0 || best === this.lastProbedNode) return;
    this.lastProbedNode = best;
    this.lastProbeAt = this.elapsed;
    this.addFlash(this.nodes[best].x, this.nodes[best].y, true);
  }

  private update(deltaSeconds: number): void {
    // Hold all signals until the structure has finished drawing itself in.
    if (this.elapsed < INTRO_MS * 0.9) return;

    const routes = this.routes;

    for (let i = 0; i < this.packets.length; i += 1) {
      const packet = this.packets[i];
      if (packet.wait > 0) {
        packet.wait -= deltaSeconds;
        continue;
      }

      const route = routes[packet.route];
      if (!route) continue;

      packet.t += (packet.speed / Math.max(route.length, 1)) * deltaSeconds;
      if (packet.t < 1) continue;

      this.addFlash(route.terminalX, route.terminalY, packet.accent);
      packet.route = this.pickRoute();
      packet.t = 0;
      packet.accent = Math.random() < 0.28;
      packet.speed = 110 + Math.random() * 120;
      packet.wait = 0.4 + Math.random() * 2;
    }

    const idle = this.elapsed - this.lastPointerMove;
    const presence = idle > PROBE_IDLE_MS ? 0 : clamp(1 - idle / PROBE_IDLE_MS, 0, 1);
    this.pointerPresence = presence;
    if (presence > 0) this.probeNode();
  }

  // ---------------------------------------------------------------- render

  private revealDistances(intro: number): void {
    const routes = this.routes;
    const visible = this.visible;
    const eased = 1 - Math.pow(1 - intro, 3);

    for (let i = 0; i < routes.length; i += 1) {
      const route = routes[i];
      if (route.parent < 0) {
        visible[i] = eased * route.length;
        continue;
      }
      const parentDistance = visible[route.parent] ?? 0;
      const growth = clamp((parentDistance - route.attach) / GROWTH_PX, 0, 1);
      visible[i] = growth * route.length;
    }
  }

  private paint(time: number): void {
    const ctx = this.context;
    const width = this.width;
    const height = this.height;
    const routes = this.routes;

    ctx.clearRect(0, 0, width, height);
    if (width === 0 || height === 0 || routes.length === 0) return;

    const intro = clamp(time / INTRO_MS, 0, 1);
    this.revealDistances(intro);

    const lift = this.staticFrame ? 0 : this.pointerPresence * 0.05;
    ctx.strokeStyle = this.inkCss;
    ctx.fillStyle = this.inkCss;
    ctx.lineCap = 'butt';

    // The bus reads brighter than the branches: it is the spine of the drawing.
    ctx.beginPath();
    this.traceRoute(routes[0], this.visible[0]);
    ctx.globalAlpha = 0.2 + lift;
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Branches, cut at their own reveal distance.
    ctx.beginPath();
    for (let i = 1; i < routes.length; i += 1) {
      this.traceRoute(routes[i], this.visible[i]);
    }
    ctx.globalAlpha = 0.15 + lift;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Junctions where a route leaves the bus.
    ctx.beginPath();
    for (let i = 0; i < routes.length; i += 1) {
      const route = routes[i];
      if (route.parent !== 0) continue;
      if (this.visible[0] < route.attach + 2) continue;
      ctx.rect(route.segments[0].x1 - 1.25, route.segments[0].y1 - 1.25, 2.5, 2.5);
    }
    ctx.globalAlpha = 0.26 + lift;
    ctx.fill();

    // Dimension line and its level ticks, the architect's mark on the drawing.
    const dim = this.dimension;
    if (dim.levels.length > 0 && intro > 0.75) {
      ctx.beginPath();
      ctx.moveTo(dim.x, dim.top);
      ctx.lineTo(dim.x, dim.bottom);
      for (let i = 0; i < dim.levels.length; i += 1) {
        const y = dim.levels[i];
        ctx.moveTo(dim.x - 6, y);
        ctx.lineTo(dim.x + 6, y);
      }
      ctx.globalAlpha = 0.2 * clamp((intro - 0.75) / 0.25, 0, 1);
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }

    // Terminal nodes, only once their route has finished growing.
    ctx.beginPath();
    for (let i = 0; i < routes.length; i += 1) {
      if (this.visible[i] < routes[i].length - 0.5) continue;
      ctx.rect(routes[i].terminalX - 1.7, routes[i].terminalY - 1.7, 3.4, 3.4);
    }
    ctx.globalAlpha = 0.45 + lift;
    ctx.fill();

    if (!this.staticFrame && intro > 0.9) {
      this.drawPackets();
      this.drawFlashes(time);
    }

    ctx.globalAlpha = 1;
  }

  /** Adds the visible portion of a route to the current path. */
  private traceRoute(route: Route, distance: number): void {
    if (distance <= 0) return;
    const ctx = this.context;
    const segments = route.segments;

    for (let i = 0; i < segments.length; i += 1) {
      const segment = segments[i];
      const length = Math.abs(segment.x2 - segment.x1) + Math.abs(segment.y2 - segment.y1);
      if (distance <= segment.d0) break;

      const amount = clamp((distance - segment.d0) / Math.max(length, 0.001), 0, 1);
      const x = segment.x1 + (segment.x2 - segment.x1) * amount;
      const y = segment.y1 + (segment.y2 - segment.y1) * amount;

      ctx.moveTo(segment.x1, segment.y1);
      ctx.lineTo(x, y);
    }
  }

  private drawPackets(): void {
    const ctx = this.context;

    for (let i = 0; i < this.packets.length; i += 1) {
      const packet = this.packets[i];
      if (packet.wait > 0) continue;

      const route = this.routes[packet.route];
      if (!route) continue;

      const position = clamp(packet.t, 0, 1) * route.length;
      const point = this.pointAt(route, position);
      if (!point) continue;

      if (point.y < -20 || point.y > this.height + 20) continue;

      ctx.fillStyle = packet.accent ? this.accentCss : this.inkCss;
      ctx.globalAlpha = packet.accent ? 0.16 : 0.12;
      ctx.fillRect(point.x - 4, point.y - 4, 8, 8);

      ctx.globalAlpha = 1;
      ctx.fillRect(point.x - 1.5, point.y - 1.5, 3, 3);

      const tail = this.pointAt(route, Math.max(0, position - 22));
      if (tail) {
        ctx.globalAlpha = packet.accent ? 0.4 : 0.3;
        ctx.beginPath();
        ctx.moveTo(tail.x, tail.y);
        ctx.lineTo(point.x, point.y);
        ctx.lineWidth = 1.4;
        ctx.strokeStyle = packet.accent ? this.accentCss : this.inkCss;
        ctx.stroke();
      }
    }
  }

  private pointAt(route: Route, distance: number): { x: number; y: number } | null {
    const segments = route.segments;
    for (let i = 0; i < segments.length; i += 1) {
      const segment = segments[i];
      const length = Math.abs(segment.x2 - segment.x1) + Math.abs(segment.y2 - segment.y1);
      if (distance > segment.d0 + length) continue;
      const amount = clamp((distance - segment.d0) / Math.max(length, 0.001), 0, 1);
      return {
        x: segment.x1 + (segment.x2 - segment.x1) * amount,
        y: segment.y1 + (segment.y2 - segment.y1) * amount,
      };
    }
    return null;
  }

  private drawFlashes(time: number): void {
    const ctx = this.context;
    ctx.lineWidth = 1;

    for (let i = this.flashes.length - 1; i >= 0; i -= 1) {
      const flash = this.flashes[i];
      const progress = (time - flash.born) / FLASH_LIFE_MS;
      if (progress >= 1 || progress < 0) {
        this.flashes.splice(i, 1);
        continue;
      }

      ctx.strokeStyle = flash.accent ? this.accentCss : this.inkCss;
      ctx.globalAlpha = (1 - progress) * (1 - progress) * 0.5;
      ctx.beginPath();
      ctx.arc(flash.x, flash.y, 2 + progress * 18, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  private paintStatic(): void {
    this.staticFrame = true;
    this.elapsed = INTRO_MS * 1.4;
    this.paint(this.elapsed);
    this.staticFrame = false;
  }

  // ---------------------------------------------------------------- loop

  private shouldAnimate(): boolean {
    return (
      this.started && !this.destroyed && !this.reducedMotion && this.pageVisible && this.inViewport
    );
  }

  private syncLoop(): void {
    if (this.shouldAnimate()) {
      if (this.rafId === null) {
        this.lastFrame = 0;
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

    const delta = this.lastFrame === 0 ? 16.7 : clamp(now - this.lastFrame, 0, MAX_FRAME_MS);
    this.lastFrame = now;
    this.elapsed += delta;

    this.update(delta / 1000);
    this.paint(this.elapsed);

    this.rafId = window.requestAnimationFrame(this.frame);
  };

  // ---------------------------------------------------------------- listeners

  private attachListeners(): void {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
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

    if (typeof IntersectionObserver !== 'undefined') {
      this.observer = new IntersectionObserver(this.onIntersect);
      this.observer.observe(this.container);
    }
  }

  private readonly onPointerMove = (event: PointerEvent): void => {
    if (this.destroyed || this.reducedMotion) return;
    this.pointerX = event.clientX;
    this.pointerY = event.clientY;
    this.lastPointerMove = this.elapsed;
  };

  private readonly onPointerLeave = (): void => {
    this.lastPointerMove = 0;
    this.pointerPresence = 0;
    this.lastProbedNode = -1;
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
      if (this.reducedMotion) this.paintStatic();
      else this.paint(this.elapsed);
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
    this.readColors();
    if (this.reducedMotion) this.paintStatic();
    else this.paint(this.elapsed);
  };

  private readonly onMotionPreference = (event: MediaQueryListEvent): void => {
    if (this.destroyed) return;
    this.reducedMotion = event.matches;
    if (this.reducedMotion) this.paintStatic();
    this.syncLoop();
  };
}
