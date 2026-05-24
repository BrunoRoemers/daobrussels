import { defineCollection, z, reference } from 'astro:content';

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    address: z.string().optional(),
    images: z.array(z.string()).default([]),
    meetupUrl: z.string().url().optional(),
    going: z.number().optional(),
    // Manual curation fields (optional, added by hand after import)
    summary: z.string().optional(),
    nostrEventTag: z.string().optional(),
    pods: z.array(reference('pods')).default([]),
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
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { events, pods };
