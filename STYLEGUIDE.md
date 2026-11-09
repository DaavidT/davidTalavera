# David Talavera Portfolio Style Guide

This guide protects the visual language and content patterns of David Talavera's portfolio. The source of truth is [src/styles/global.scss](src/styles/global.scss).

## Visual Tokens

| Token               | Use                                                                        |
| ------------------- | -------------------------------------------------------------------------- |
| `$blog-bg`          | Primary dark page surface.                                                 |
| `$body-bg`          | Red action and emphasis surface.                                           |
| `$detail-bg`        | Inline code surface.                                                       |
| `$title-color`      | High-contrast headings.                                                    |
| `$subtitle-color`   | Supporting copy and navigation.                                            |
| `$border-color`     | Dividers and field borders.                                                |
| `$interaction-glow` | Hover and active glow on navigation and links.                             |
| `$accent-dark`      | Darker red for gradient ends, derived from `$body-bg` with `color.adjust`. |

The brand red is `$body-bg` (`#c4101d`). Do not add another red hex; derive a variant from the token instead.

## Theme Tokens

Components read semantic custom properties declared once in `global.scss`. Light and dark are both composed explicitly; dark is not an inverted copy of light. Do not branch on a theme class inside a component.

| Property                 | Light                | Dark                    |
| ------------------------ | -------------------- | ----------------------- |
| `--color-bg`             | `#ffffff`            | `#0b0b0d`               |
| `--color-surface`        | `#f7f5f4`            | `#161519`               |
| `--color-surface-hover`  | `#f0edeb`            | `#1e1d22`               |
| `--color-surface-subtle` | `#fbfaf9`            | `#101014`               |
| `--color-text-primary`   | `#0b0b0d`            | `#f5f3f2`               |
| `--color-text-secondary` | `#52525a`            | `#b8b4b1`               |
| `--color-accent-primary` | `$body-bg`           | `$body-bg`              |
| `--color-accent-text`    | `$body-bg`           | `$accent-text-dark`     |
| `--color-on-accent`      | `#ffffff`            | `#ffffff`               |
| `--color-border`         | `rgba(11,11,13,.12)` | `rgba(255,255,255,.12)` |
| `--color-border-strong`  | `rgba(11,11,13,.22)` | `rgba(255,255,255,.22)` |
| `--logo-tile-bg`         | `#0b0b0d`            | `#0b0b0d`               |

`--color-accent-primary` is the brand fill. `--color-accent-text` is the same hue lightened for readable text: text sits on white in light and on near-black in dark, so the dark value is derived with `color.adjust($body-bg, $lightness: 26%)` instead of adding a new red. `--color-on-accent` is for the red contact section in both themes, where the accent surface does not change.

## Theming

Theme state lives on the root element as `html.light` or `html.dark`. With no class, the page follows `prefers-color-scheme`. The theme toggle writes the choice to `localStorage` under `david-talavera-theme`; the inline head script applies it before first paint to avoid a flash. The toggle icon is the `ThemeToggle` component and sits to the left of `LanguageSelector`.

## Keyboard Focus

Every interactive element uses one `:focus-visible` ring defined in `global.scss`. Do not add per-component `outline` values; change the tokens instead.

| Token                 | Value          | Purpose                                                                             |
| --------------------- | -------------- | ----------------------------------------------------------------------------------- |
| `--focus-ring-width`  | `2px`          | Ring thickness.                                                                     |
| `--focus-ring-offset` | `3px`          | Gap between the element and the ring.                                               |
| `--focus-ring-color`  | `currentColor` | Follows the text color, so the ring stays visible on dark, red, and light surfaces. |

The interface is a high-contrast system with red emphasis, composed for both light and dark surfaces. Keep the existing palette, border weight, typography, and responsive behavior consistent.

## Typography

| Family                  | Role                                         |
| ----------------------- | -------------------------------------------- |
| Space Grotesk           | Display titles and headings.                 |
| Inter                   | Body copy and interface text.                |
| Playfair Display Italic | Restrained emphasis and supporting metadata. |

Use concise headings and professional language. Do not introduce another font, gradients, or unrelated accent colors.

## Page Patterns

| Area                           | Responsibility                                         |
| ------------------------------ | ------------------------------------------------------ |
| `src/pages/index.astro`        | Portfolio overview and featured profiles.              |
| `src/pages/profile.astro`      | Professional profile and background.                   |
| `src/pages/experience.astro`   | Company highlights and detailed experience.            |
| `src/pages/skills.astro`       | Technical focus areas.                                 |
| `src/pages/contact.astro`      | Contact information and form.                          |
| `src/layouts/PageLayout.astro` | Shared internal-page navigation, metadata, and footer. |

## Content and Images

Use `src/content/profiles/` for detailed experience, `src/content/work/` for company highlights, and `src/content/featured/` for technical skills.

Do not use generic stock or inherited imagery as project evidence. When David-owned imagery is unavailable, use `/portfolio-placeholder.webp`; it is intentionally labeled so visitors know it is a neutral placeholder.

## Accessibility and Responsiveness

Maintain descriptive navigation labels, visible keyboard focus, and semantic headings. Check changes at desktop and mobile breakpoints. Images that communicate content need meaningful alternative text; decorative images should use an empty `alt` attribute.

## Type Scale

Every fixed font size uses one of these steps, declared in `global.scss`. Fluid sizes (`clamp`, `vw`) stay on purpose for hero titles.

| Token            | Value                        | Typical use                      |
| ---------------- | ---------------------------- | -------------------------------- |
| `--text-2xs`     | 0.75rem                      | Eyebrows and fine labels.        |
| `--text-xs`      | 0.8125rem                    | Metadata and captions.           |
| `--text-sm`      | 0.875rem                     | Secondary body and descriptions. |
| `--text-base`    | 1rem                         | Body copy.                       |
| `--text-md`      | 1.125rem                     | Lead paragraphs and card titles. |
| `--text-lg`      | 1.25rem                      | Subheadings.                     |
| `--text-xl`      | 1.5rem                       | Section headings.                |
| `--text-2xl`     | 1.75rem                      | Large headings.                  |
| `--text-3xl`     | 2.5rem                       | Page titles.                     |
| `--text-display` | `clamp(2.5rem, 6vw, 4.5rem)` | Hero display.                    |
