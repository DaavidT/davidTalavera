import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const profiles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/profiles' }),
  schema: z.object({
    title: z.string(),
    bigTitle: z.string(),
    emphasis: z.string().optional(),
    headline: z.string(),
    excerpt: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    cover: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const featured = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/featured' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    date: z.coerce.date(),
    order: z.number(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    year: z.string(),
    cover: z.string(),
    summary: z.string(),
    url: z.string().url().optional(),
    order: z.number().default(0),
  }),
});

export const collections = { profiles, featured, work };
