import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    keyword: z.string(),
    vertical: z.enum(['hvac', 'dental', 'law', 'auto_repair', 'veterinary', 'beauty_salon']),
    author: z.string().optional(),
    readingTime: z.number().optional(),
    tags: z.array(z.string()).optional(),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).optional(),
    draft: z.boolean().default(false),
  }),
});

// Group C (aios-starter-kit scripts/seo/integration_pages.py writes these). Every capability and
// source traces to a verified fact in aios-starter-kit data/seo-facts/facts.json. Only status "live" is built;
// "withdrawn" pages 404 and drop out of the sitemap, index and vertical "Works with" links.
const integrations = defineCollection({
  type: 'data',
  schema: z.object({
    platform: z.string(),
    slug: z.string().regex(/^[a-z0-9-]+$/),
    vertical: z.enum(['hvac', 'dental', 'law', 'auto_repair', 'veterinary', 'beauty_salon']),
    status: z.enum(['live', 'withdrawn']),
    title: z.string().max(70),
    metaDescription: z.string().max(160),
    headline: z.string(),
    subhead: z.string(),
    intro: z.array(z.string()).min(1).max(3),
    capabilities: z.array(z.object({ text: z.string(), factIds: z.array(z.string()).min(1) })).min(1),
    howItWorks: z.array(z.object({ title: z.string(), body: z.string() })).length(3),
    faqs: z.array(z.object({ q: z.string(), a: z.string() })).min(3).max(6),
    sources: z.array(z.object({ id: z.string(), label: z.string(), url: z.string().url(), retrieved: z.string() })).min(1),
    lastVerified: z.string(),
    keyword: z.string().optional(),
  }),
});

export const collections = { blog, integrations };
