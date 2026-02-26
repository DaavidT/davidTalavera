import { defineConfig, envField } from 'astro/config';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com', // IMPORTANT: Replace with your actual domain in production
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkReadingTime],
      syntaxHighlight: {
        type: 'shiki',
        excludeLangs: ['mermaid'],
      },
    }),
  ],

  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    routing: {
      prefixDefaultLocale: false,
    },
  },

  env: {
    schema: {
      RESEND_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
      }),
      RESEND_FROM_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      CONTACT_FORM_TO_EMAIL: envField.string({
        context: 'server',
        access: 'secret',
      }),
      CONTACT_RATE_LIMIT_MAX_REQUESTS: envField.number({
        context: 'server',
        access: 'secret',
        default: 5,
      }),
      CONTACT_RATE_LIMIT_WINDOW_MS: envField.number({
        context: 'server',
        access: 'secret',
        default: 3_600_000,
      }),
      CONTACT_GLOBAL_RATE_LIMIT_MAX_REQUESTS: envField.number({
        context: 'server',
        access: 'secret',
        default: 30,
      }),
      CONTACT_GLOBAL_RATE_LIMIT_WINDOW_MS: envField.number({
        context: 'server',
        access: 'secret',
        default: 3_600_000,
      }),
      CONTACT_MIN_FORM_FILL_MS: envField.number({
        context: 'server',
        access: 'secret',
        default: 2_500,
      }),
      CONTACT_MAX_CONTENT_LENGTH: envField.number({
        context: 'server',
        access: 'secret',
        default: 10_000,
      }),
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: vercel(),
});
