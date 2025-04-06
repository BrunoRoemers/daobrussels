import { anyone } from '@/access/anyone';
import { authenticated } from '@/access/authenticated';
import { compositeTitle } from '@/collections/PodsAtEvents/fields/composite-title';
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
  ],
};
