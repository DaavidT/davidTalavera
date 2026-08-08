# David Talavera Portfolio Style Guide

This guide protects the visual language and content patterns of David Talavera's portfolio. The source of truth is [src/styles/global.scss](src/styles/global.scss).

## Visual Tokens

| Token | Use |
| --- | --- |
| `$blog-bg` | Primary dark page surface. |
| `$body-bg` | Red action and emphasis surface. |
| `$detail-bg` | Inline code surface. |
| `$title-color` | High-contrast headings. |
| `$subtitle-color` | Supporting copy and navigation. |
| `$border-color` | Dividers and field borders. |

The interface uses a dark, high-contrast system with red emphasis. Keep the existing palette, border weight, typography, and responsive behavior consistent.

## Typography

| Family | Role |
| --- | --- |
| Space Grotesk | Display titles and headings. |
| Inter | Body copy and interface text. |
| Playfair Display Italic | Restrained emphasis and supporting metadata. |

Use concise headings and professional language. Do not introduce another font, gradients, or unrelated accent colors.

## Page Patterns

| Area | Responsibility |
| --- | --- |
| `src/pages/index.astro` | Portfolio overview and featured profiles. |
| `src/pages/profile.astro` | Professional profile and background. |
| `src/pages/experience.astro` | Company highlights and detailed experience. |
| `src/pages/skills.astro` | Technical focus areas. |
| `src/pages/contact.astro` | Contact information and form. |
| `src/layouts/PageLayout.astro` | Shared internal-page navigation, metadata, and footer. |

## Content and Images

Use `src/content/profiles/` for detailed experience, `src/content/work/` for company highlights, and `src/content/featured/` for technical skills.

Do not use generic stock or inherited imagery as project evidence. When David-owned imagery is unavailable, use `/portfolio-placeholder.webp`; it is intentionally labeled so visitors know it is a neutral placeholder.

## Accessibility and Responsiveness

Maintain descriptive navigation labels, visible keyboard focus, and semantic headings. Check changes at desktop and mobile breakpoints. Images that communicate content need meaningful alternative text; decorative images should use an empty `alt` attribute.
