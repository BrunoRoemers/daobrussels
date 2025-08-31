import type { CollectionConfig } from 'payload';

import { slugField } from '@/fields/slug';
import { authenticated } from '../auth/access-filters/authenticated';
import { authenticatedOrPublished } from '../auth/access-filters/authenticated-or-published';
import { setPublicationDate } from '../shared/config/set-publication-date-hook';
import { revalidatePod } from './config/revalidate-pod-hook';

export const Pods: CollectionConfig = {
  slug: 'pods',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    // livePreview: {
    //   url: generateLivePreviewUrl('pods'),
    // },
    // preview: generatePreviewUrl('pods'),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'events',
      type: 'join',
      collection: 'podsAtEvents',
      on: 'pod',
      defaultSort: '-updatedAt',
      admin: {
        defaultColumns: ['event', 'host'],
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePod],
    beforeChange: [setPublicationDate],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
};
