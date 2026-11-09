# Backdrop guides: scroll line, pointer line, click rings

## Objective
Add an interactive drafting layer on top of the existing schematic backdrop:
- a horizontal guide that follows scroll progress,
- a vertical guide that follows the pointer,
- an expanding ring on click, using the same material as the schematic node flashes.

This is additive. The existing `BackdropSchematic` engine is untouched.

## Scope
- New background-layer canvas (`z-index: -1`, `pointer-events: none`).
- New `src/scripts/backdrop-guides.ts` engine.
- `src/components/Backdrop.astro` mounts the canvas and boots the guides next to the schematic.
- No changes to routes, content, language selector, or the schematic drawing.

## Implementation
- `BackdropGuides` owns its own canvas, DPR cap 2, debounced resize, colour tokens read from `--pb-ink` / `--pb-accent` on the existing `.backdrop` element, and theme-change repaint.
- Scroll guide: maps `scrollY / (scrollHeight - innerHeight)` to 8%–92% of the viewport, fades in while scrolling and out after 900 ms + 600 ms fade.
- Pointer guide: vertical gradient line at `clientX` with a short horizontal tick at `clientY`; hides on `pointerleave`.
- Click ring: `pointerdown` pushes a ring at `clientX/clientY`; expands with an ease-out curve and fades over 1.1 s. Under reduced motion the ring keeps a fixed radius.
- Event-driven painting: `requestPaint()` coalesces to one RAF; the loop only continues while click rings exist or the scroll fade is active.
- Hidden tab pauses painting; theme/class changes repaint.

## Verification
- `npm run build` → 7 pages, `Complete!`.
- `npx prettier --check` → clean.
- `dist/index.html`: `data-backdrop-guides` and `backdrop-guides__canvas` present.
- CSS: `.backdrop-guides` has `z-index: -1` and `pointer-events: none`.
- Bundle: `pointerdown` and `scroll` listeners present.

## Known notes
- The guides live in the background layer, below every page component, so the profile cards, section headers, and text are never crossed by the animation. They remain visible in the hero and through translucent sections.
- Reduced motion keeps the lines (user-driven) and shows a non-expanding click ring.

## Next step
- Review visually in the browser and tune alpha/radius if needed. Nothing committed or pushed.
