import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    category: z.enum(['AI & Engineering', 'Client Work', 'Entrepreneurship', 'Creative Work']),
    role: z.string(),
    dateRange: z.string(),
    summary: z.string(),
    seoTitle: z.string().optional(),
    technologies: z.array(z.string()),
    website: z.url(),
    media: z.string().optional(),
    poster: z.string().optional(),
    awards: z.array(z.string()).default([]),
    decisions: z.array(z.string()).default([]),
    featuredOrder: z.number(),
    evidence: z.string(),
    socialImage: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    author: z.string(),
    slug: z.string(),
    socialImage: z.string(),
    imageAlt: z.string(),
    draft: z.boolean().default(false),
    schemaType: z.literal('BlogPosting').default('BlogPosting'),
  }),
});

export const collections = { projects, blog };
