import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    keyword: z.string(),
    vertical: z.enum(['hvac', 'dental', 'law', 'auto_repair', 'veterinary']),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
