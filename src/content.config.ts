import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    channel: z.enum(['blog', 'lp', 'ads', 'email']),
    product: z.enum(['SBU-K', 'SBU-M', 'SBU-B', 'SKK', 'OSS', 'KTA']),
    voice_mode: z.enum(['corporate', 'personal']).default('corporate'),
    publishedAt: z.date(),
    faqSchema: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  }),
});

const lp = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lp' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    channel: z.literal('lp'),
    product: z.enum(['SBU-K', 'SBU-M', 'SBU-B', 'SKK', 'OSS', 'KTA']),
    voice_mode: z.enum(['corporate', 'personal']).default('corporate'),
    ctaType: z.enum(['wa-human', 'wa-ara', 'form']),
  }),
});

export const collections = { blog, lp };