# Reposition content: Systems Engineer, Automation & Applied AI

## Objective
Replace the "full-stack developer / solutions architect" positioning across the site with "Ingeniero en Sistemas especializado en automatización e IA aplicada" (English: Systems Engineer specializing in automation and applied AI), without inventing credentials or changing the factual companies and dates.

## Problem
The visible copy still says "Desarrollador full-stack", "Arquitecto de Soluciones", "Full-Stack Development", "Backend", "Frontend" and "full-stack" in the hero, metadata, profile, experience, skills cards, work summaries, featured focus areas, and profile articles.

## Scope
- Copy only: dictionaries, collection frontmatter/bodies, component fallbacks, JSON-LD, RSS, page props.
- Keep the language selector, the backdrop, the routes, and the company/date history.
- Keep "applied AI" framed as practical exploration, not as a claim of AI research credentials.
- Leave the `technical-product-owner` long article as-is; it describes a business-systems role, not a developer role.

## Tasks
- [ ] T1: Update `src/i18n.ts` `es` and `en` values (site, hero, about, profile, experience, skills, contact, work, featured).
- [ ] T2: Update `src/content/work/*.md` summaries.
- [ ] T3: Update `src/content/featured/*.md` titles/subtitles.
- [ ] T4: Update `src/content/profiles/hir-seguros.md` and `central-invirzo.md` frontmatter and English bodies.
- [ ] T5: Rewrite the four skill cards in `SkillsSection.astro` (Automation, Applied AI, Systems & data, Cloud & delivery) and update the header fallback.
- [ ] T6: Update `BaseLayout` defaults and JSON-LD, `index.astro` props, `HeroSection`, `Backdrop`, `AboutSection`, `ProfileSection`, `ExperienceSection`, `Circle`, and `rss.xml.ts`.
- [ ] T7: Build, Prettier, and grep for leftover developer positioning.

## Acceptance criteria
- No visible "Desarrollador full-stack", "Full-Stack Developer", "Arquitecto de Soluciones", "Backend", "Frontend", or "full-stack" copy remains.
- The hero, title, description, profile and skills describe a Systems Engineer focused on automation and applied AI.
- Spanish remains the server-rendered default and English still works.
- `npm run build` succeeds and Prettier is clean.

## Checks
- `npm run build`
- `npx prettier --check` on changed files
- `rg -n "Full-Stack|Full-stack|full-stack|Desarrollador|Developer|Arquitecto|Frontend|Backend" src`

## Progress
- [x] T1: `src/i18n.ts` `es`/`en` repositioned (site, hero, about, profile, experience, skills, contact, work, featured); skill-card keys renamed to `automation` / `appliedAi` / `systemsData` / `cloudDelivery`.
- [x] T2: Work summaries updated (`banorte`, `hir-seguros`, `central-invirzo`).
- [x] T3: Featured focus areas updated (`python-javascript`, `react-typescript`, `cloud-delivery`, `applied-ai`, `engineering-foundations`).
- [x] T4: `hir-seguros.md` and `central-invirzo.md` frontmatter and English bodies updated.
- [x] T5: `SkillsSection.astro` rewritten to Automation / Applied AI / Systems & data / Cloud & delivery with matching icons and items.
- [x] T6: `BaseLayout` defaults + JSON-LD, `index.astro`, `HeroSection`, `Backdrop`, `AboutSection`, `ProfileSection`, `ExperienceSection`, `Circle`, `rss.xml.ts` updated.
- [x] T7: Build and formatting verified.

## Verification evidence
- `npm run build` → `7 page(s) built`, `Complete!`.
- `npx prettier --check` on all changed files → clean.
- Built `dist/index.html`: "Ingeniero en Sistemas", "Automatización e IA aplicada", "Capacidades y enfoque", "Sistemas y datos", "Cloud y entrega", new profile intro, new work summaries and focus areas.
- Built HTML has no `Desarrollador full-stack`, `Arquitecto de Soluciones`, `Full-Stack`, `Backend`, `Frontend`, or `full-stack`.
- `dist/rss.xml` carries the new profile titles and description.
- English dictionary bundle carries the new positioning for the language switch.

## Notes
- `src/content/profiles/technical-product-owner.md` and its Spanish `experience.technical-product-owner.body` were intentionally left untouched. It is a business-systems/TPO role description, not developer positioning. If the home card should also be removed or rewritten, that is a separate decision.
- `contact.description` remains in the dictionary but is not rendered on the current home page.

## Next step
- Review the diff and decide whether to commit. Nothing has been committed or pushed.
