# David Talavera Portfolio

This repository contains David Talavera's bilingual professional portfolio. It presents his profile, full-stack experience, technical focus, and contact information.

## Quick Start

```bash
npm install
npm run dev
```

The local site runs at `http://localhost:4321`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server. |
| `npm run build` | Create the production build in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run format:check` | Check formatting with Prettier. |

## Site Structure

| Route | Purpose |
| --- | --- |
| `/` | Portfolio overview and featured professional profiles. |
| `/profile` | Biography, background, and professional focus. |
| `/experience` | Selected companies and detailed role profiles. |
| `/skills` | Technical skills and areas of focus. |
| `/contact` | Direct contact details and mail form. |
| `/rss.xml` | RSS feed for experience profiles. |

## Content Updates

Professional profiles live in `src/content/profiles/`. Add a Markdown file with the required frontmatter:

```md
---
title: 'Role or professional area'
bigTitle: 'Company or focus'
headline: 'Concise professional summary'
excerpt: 'Short description used in cards and metadata.'
author: 'David Talavera'
date: 2026-01-01
cover: '/portfolio-placeholder.webp'
featured: false
---

Profile details in Markdown.
```

Use the local `portfolio-placeholder.webp` until a David-owned project image is available. Technical focus entries are in `src/content/featured/`; experience highlights are in `src/content/work/`.

## Deployment

The canonical production domain is `https://davidtalavera.com`. Update deployment configuration outside this repository to serve that domain before publishing.

## License

See [LICENSE](LICENSE).
