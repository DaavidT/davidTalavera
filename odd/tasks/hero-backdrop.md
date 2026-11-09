# Hero backdrop: architectural schematic

## Objective
Replace the hero background animation with a distinctive, legible "living system diagram" and replace the bouncing scroll arrow with a cue that shares the same material language.

## Problem
- The old Matrix rain was drawn with the background color (`21 21 23` over `#0b0b0d`), so it was almost invisible.
- `touchstart` with `preventDefault` blocked touch scrolling.
- The grid re-randomised on every frame.
- The scroll indicator was a generic bouncing arrow.

## Scope
- Hero backdrop only. No changes to content, routing, or the language selector.
- Keep static output and no new dependencies.

## Tasks
- [x] T1: Create `src/scripts/backdrop-schematic.ts` (orthogonal bus, branches, taps, terminal nodes, dimension line, signal packets, pointer probe).
- [x] T2: Create `src/components/Backdrop.astro` and replace `PixelBackground.astro`.
- [x] T3: Replace the bouncing arrow in `HeroSection.astro` with a signal travelling a vertical rail.
- [x] T4: Remove the old engines (`matrix-grid.ts`, `PixelBackground.astro`, `pixel-grid.ts`) and the no-op `parallax.ts` init.
- [x] T5: Localise the name-plate role label (`hero.role`) so the Spanish default does not show English.
- [x] T6: Build and verify.

## Implementation notes
- Canvas: DPR capped at 2, debounced resize, reduced-motion static frame, pause on hidden tab, colour tokens `--pb-ink` / `--pb-accent`, theme changes observed.
- Intro: the bus energises top-down and branches grow when reached; then packets run and terminals flare.
- Pointer: nearest node within 170px flares, with idle decay.
- Name plate: `<p>` elements (was two decorative `h1`), `aria-hidden`, light/dark ink, mobile hidden.
- Scroll cue: `<a href="#about">` with a rail and a travelling signal; reduced-motion fallback.

## Verification
- `npm run build` → 7 pages, `Complete!`.
- `npx prettier --check` → clean.
- Built `dist/index.html`: backdrop canvas, name plate, Spanish role, scroll cue and rail present; no `scroll-indicator`, `pixel-background`, or matrix class.
- Bundle: `BackdropSchematic` and reduced-motion handling present; no `pixel-grid`.

## Known limitation
- On desktop the visible hero name lives in the decorative plate; the `<h1>` in `.hero-intro` is `display: none`. This was pre-existing. A follow-up could make the `<h1>` visually hidden instead of removed from the accessibility tree.

## Next step
- Review the diff and decide whether to commit. Nothing has been committed or pushed.
