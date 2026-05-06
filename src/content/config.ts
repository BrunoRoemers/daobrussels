import { defineCollection, z, reference } from 'astro:content';

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    locationUrl: z.string().url().optional(),
    summary: z.string().optional(),
    pods: z.array(reference('pods')).default([]),
    nostrEventTag: z.string(),
    cover: z.string().optional(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

const pods = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'paused', 'completed', 'proposed']).default('active'),
    startDate: z.coerce.date().optional(),
    events: z.array(reference('events')).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { events, pods };
