import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    keyword: z.string(),
    vertical: z.enum(['hvac', 'dental', 'law', 'restaurant', 'general']),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
