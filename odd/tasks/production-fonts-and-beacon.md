# Production errors: fonts and Cloudflare beacon

## Objective
Fix the two console errors reported in production:
1. Space Grotesk rejected by the font sanitizer.
2. Cloudflare Insights beacon blocked by CORS and SRI.

## Font error (fixed in the repo)
### Cause
Every file in `public/fonts/` was a Google **404 HTML page** saved with a `.woff2` extension (first bytes `<!DOCTYPE html>`). The browser rejected them as invalid fonts. The same placeholder was duplicated across weights.

### Fix
- Downloaded the real Latin variable WOFF2 files from Google Fonts:
  - `public/fonts/space-grotesk.woff2` (22 KB, weight axis 300–700)
  - `public/fonts/inter.woff2` (48 KB, weight axis 100–900)
  - `public/fonts/playfair-display-italic.woff2` (38 KB, weight axis 400–900)
- Rewrote `src/styles/fonts.scss` with one `@font-face` per family/style and a `font-weight` range, since Google serves the same variable file for every weight.
- Deleted the ten invalid placeholder files.

### Verification
- `npm run build` → 7 pages, `Complete!`.
- `dist/fonts/` contains only the three new files, all starting with `wOF2`.
- `dist/_astro/*.css` references `/fonts/space-grotesk.woff2`, `/fonts/inter.woff2`, and `/fonts/playfair-display-italic.woff2`; no old `*-400`/`*-500` URLs remain.
- `npx prettier --check src/styles/fonts.scss` → clean.

## Cloudflare beacon error (not in the repo)
### Cause
Cloudflare Web Analytics automatic injection adds:
```html
<script defer src="https://static.cloudflareinsights.com/beacon.min.js/..." integrity="sha512-..." crossorigin="anonymous"></script>
```
The injected `integrity` hash no longer matches the beacon served by the edge, so SRI blocks it and the CORS check fails. The beacon is not in `src/` or `dist/`; Cloudflare adds it at the edge.

### Fix (dashboard, not code)
- Cloudflare dashboard → Analytics & Logs → Web Analytics → Manage site:
  - **Disable** to stop tracking and the injection, or
  - **Enable with JS Snippet installation** to disable automatic injection and install the manual snippet (no `integrity`).
- For a Pages project: Workers & Pages → project → Metrics → Web Analytics, or the site's Web Analytics settings.

### Code-side alternative
If the dashboard is not accessible and analytics is not needed, adding `no-transform` to the HTML `Cache-Control` in `src/middleware.ts` prevents Cloudflare from injecting the beacon (the docs note `public, no-transform` blocks automatic injection). This also disables other edge HTML transforms, so it is a fallback, not the default.

## Notes
- The font fix is committed to the working tree only; nothing has been committed or pushed.
- The beacon fix requires a Cloudflare account action.
