import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/features/blog/content',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      heroImage: z.object({
        url: image(),
        alt: z.string(),
      }),
      tags: z.array(z.string()).optional(),
      relatedPosts: z.array(reference('blog')),
      readingTimeMinutes: z.number().optional(), // Added by remark plugin
      isDraft: z.boolean(),
      lang: z.enum(['es', 'en']).optional().default('es'),
    }),
});

const tipsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.mdx',
    base: './src/features/tips/content',
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).optional(),
      isDraft: z.boolean().default(false),
      heroImage: z
        .object({
          url: image(),
          alt: z.string(),
        })
        .optional(),
      lang: z.enum(['es', 'en']).optional().default('es'),
      relatedTips: z.array(reference('tips')).optional(),
      featured: z.boolean().optional(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    }),
});

const projectsCollection = defineCollection({
  loader: glob({
    pattern: '**/*.json',
    base: './src/features/projects/content',
  }),
  schema: z.object({
    lang: z.enum(['es', 'en']),
    slug: z.string().min(1),
    sortDate: z.coerce.date(),
    title: z.string().min(1),
    description: z.string().min(1),
    image: z.string().min(1),
    imageAltText: z.string().min(1),
    isDraft: z.boolean().default(false),
    featured: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional().default([]),
    categoryText: z.string().optional(),
    dateText: z.string().optional(),
    detailedDescription: z.string().optional(),
    keyFeatures: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
        })
      )
      .optional()
      .default([]),
    galleryImages: z
      .array(
        z.object({
          id: z.string().min(1),
          src: z.string().min(1),
          alt: z.string().min(1),
          caption: z.string().optional(),
        })
      )
      .optional()
      .default([]),
    challenges: z.string().optional(),
    learnings: z.string().optional(),
    projectUrl: z.string().url().optional(),
    codeUrl: z.string().url().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
  tips: tipsCollection,
  projects: projectsCollection,
};
