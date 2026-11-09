# Theme system and dark mode toggle

## Objective
Design a composed dark mode and add a sun/moon toggle immediately to the left of the language selector, on the home page and on internal pages.

## Design
- Semantic tokens in `src/styles/global.scss`, declared with `theme-light` and `theme-dark` mixins. Components read tokens only; they do not branch on a theme class.
- Light is the base surface. Dark is composed separately: canvas `#0b0b0d`, elevated surfaces `#161519`, lifted hover `#1e1d22`, subtle `#101014`, and its own border/text values.
- Brand red `#c4101d` stays as the fill (`--color-accent-primary`). For text in dark, the same hue is lightened with `color.adjust($body-bg, 26%)` (`--color-accent-text`), keeping 6.0–6.5:1 contrast.
- `--color-on-accent` is white in both themes for the red contact section.
- With no `html.light` / `html.dark` class, the page follows `prefers-color-scheme`. An explicit choice writes `html.dark` / `html.light` and wins over the media query.

## Toggle
- `src/components/ThemeToggle.astro`: `role="switch"`, `aria-checked`, sun and moon SVGs, i18n `aria-label`, action `title`.
- `src/scripts/theme.ts`: resolves the saved theme or the OS preference, applies the class and `color-scheme`, updates the meta theme-color, persists to `localStorage` (`david-talavera-theme`), listens for OS changes when no choice is stored, and refreshes the label on `localechange`.
- Placement: `.top-controls` on the home (fixed top-right), `.pg-nav` on internal pages, `.menu-controls` in the unused menu. Theme toggle first, language selector second.
- `BaseLayout` inline head script applies the saved theme before first paint; no page flash. `STYLEGUIDE.md` documents the tokens and theming.

## Light-mode repairs
- Profile and Skills cards, experience cards, footer, internal pages, 404, and the DT mark over the red section now use tokens or `--color-on-accent` instead of hardcoded dark/light values.

## Verification
- `npm run build` → 7 pages, `Complete!`.
- `npx prettier --check` on changed files → clean.
- Built HTML: `.top-controls` present; theme toggle precedes the language options on the home and on `/experience/*`.
- Built CSS: `--color-bg` light and dark, `html.dark`, `html.light`, `.theme-toggle`, `.top-controls`.
- Bundle: `david-talavera-theme` bootstrap present.
- Token audit: no missing `--color-*` variables; `--pb-bg` lives in `Backdrop.astro` and `--font-display` keeps its fallback.

## Notes
- `PRODUCT.md` does not exist; the implementation used the existing product as authority.
- Nothing committed or pushed.
