# Language selector and bilingual page (Spanish default)

## Objective
Add an accessible Spanish/English language selector to the site, defaulting to Spanish, and make every visible string translate correctly across the home page and the internal pages.

## Problem
- The home page renders no language control at all; `LanguageToggle` is only used by `PageLayout`, and `Menu` is not mounted anywhere.
- Several sections are hardcoded English with no `data-i18n` hook: hero headline, about CTA hero, skills card titles, home footer, work cards, featured cards.
- The page is server-rendered in English and Spanish is applied by JavaScript, so the default language is not Spanish on first paint and untagged text stays English.
- The `en` dictionary is empty, so English only works through the authored HTML fallback.

## Scope
- Languages: `es` and `en` only.
- Default locale: `es`.
- Home page: fixed selector in the top-right corner.
- Internal pages: inline selector inside the existing nav.
- No URL routing changes; the site stays fully static.

## Constraints
- No new dependencies.
- Spanish is the server-rendered default; English comes from the `en` dictionary.
- Keep the existing `data-i18n` attribute contract and extend it, not replace it.
- Generated artifacts and code comments in English; user-facing copy translated.

## Tasks
- [ ] T1: Restructure `src/i18n.ts` with complete `es` and `en` dictionaries plus the `t()` helper.
- [ ] T2: Replace `LanguageToggle` with an accessible `LanguageSelector` (ES | EN) and update `src/scripts/language.ts`.
- [ ] T3: Style `.language-selector` in `src/styles/global.scss`.
- [ ] T4: Server-render Spanish and add i18n hooks in `BaseLayout`, `PageLayout`, `SectionHeader`, the home sections, `Footer`, `HomeFooter`, `404`, and the experience detail page.
- [ ] T5: Mount the selector on the home page.
- [ ] T6: Build and verify.

## Acceptance criteria
- The home page opens in Spanish with no English flash.
- The selector offers exactly ES and EN, persists the choice in `localStorage`, and updates `<html lang>`.
- Every visible UI string switches between Spanish and English.
- `npm run build` succeeds.

## Checks
- `npm run build`

## Progress
- [x] T1: `src/i18n.ts` now has complete `es` and `en` dictionaries, `locales`, and `t(locale, key, fallback = '')`.
- [x] T2: `LanguageSelector.astro` (ES | EN, `role="group"`, `aria-pressed`, `lang`) replaced `LanguageToggle`; `src/scripts/language.ts` persists the locale and updates text/HTML/aria/alt/content/title plus the pressed state.
- [x] T3: `.language-selector`, `.language-selector--fixed`, and the `i18n-loading` reveal guard added to `global.scss`.
- [x] T4: Spanish is the server-rendered default via `t(defaultLocale, key, fallback)` across `BaseLayout`, `PageLayout`, `SectionHeader`, the home sections, `Footer`, `HomeFooter`, `404`, and the experience detail page.
- [x] T5: `LanguageSelector fixed` mounted at the top of `index.astro`.
- [x] T6: `npm run build` succeeded (7 pages); Prettier check clean.
- Review gate: `gentle-ai review status` returned `rdd_disabled` (no review transaction started).

## Verification evidence
- `npm run build` → `7 page(s) built`, `Complete!`.
- `npx prettier --check` → all matched files use Prettier style.
- Built `dist/index.html`: `<html lang="es">`, Spanish hero/about/profile/skills/footer, two `data-locale-option` buttons, no English UI leaks.
- Built detail pages: Spanish chrome and pager labels; English markdown body is still the server-rendered source and swaps to Spanish on load.

## Known limitation
- Experience detail bodies use the English markdown as the server-rendered source (Spanish swaps in via `data-i18n-html`). This avoids duplicating five long articles inside the client dictionary. The home page has no such gap.

## Next step
- Review the diff and decide whether to commit. Nothing has been committed or pushed.
