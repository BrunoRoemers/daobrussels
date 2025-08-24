import type { CollectionConfig } from 'payload';

import { slugField } from '@/fields/slug';
import { generateLivePreviewUrl, generatePreviewUrl } from '@/utilities/url/generate-preview-url';
import { authenticated } from '../../features/auth/access-filters/authenticated';
import { authenticatedOrPublished } from '../../features/auth/access-filters/authenticated-or-published';
import { populatePublishedAt } from '../../hooks/populatePublishedAt';
import { revalidateEvent } from './hooks/revalidateEvent';

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: generateLivePreviewUrl('events'),
    },
    preview: generatePreviewUrl('events'),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'pods',
      type: 'join',
      collection: 'podsAtEvents',
      on: 'event',
      // NOTE: Allow populating data from the pod, the pod's host, etc.
      maxDepth: 2,
      admin: {
        defaultColumns: ['pod', 'host'],
      },
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
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
    afterChange: [revalidateEvent],
    beforeChange: [populatePublishedAt],
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
