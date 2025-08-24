import { compositeTitle } from '@/collections/PodsAtEvents/fields/composite-title';
import { anyone } from '@/features/auth/access-filters/anyone';
import { authenticated } from '@/features/auth/access-filters/authenticated';
import type { CollectionConfig } from 'payload';

// join table; https://payloadcms.com/docs/fields/join#using-the-join-field-to-have-full-control-of-your-database-schema
export const PodsAtEvents: CollectionConfig = {
  slug: 'podsAtEvents',
  typescript: {
    interface: 'PodAtEvent',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  labels: {
    singular: 'pod at event',
    plural: 'relationships',
  },
  admin: {
    hidden: true,
    useAsTitle: 'title',
  },
  fields: [
    compositeTitle(),
    {
      name: 'pod',
      type: 'relationship',
      relationTo: 'pods',
      required: true,
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      required: true,
    },
    {
      name: 'host',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      required: true,
      defaultValue: '', // backfill existing data
      minLength: 30,
    },
  ],
};
