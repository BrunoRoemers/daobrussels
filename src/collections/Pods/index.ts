import type { CollectionConfig } from 'payload'

import { slugField } from '@/fields/slug'
import { generateLivePreviewUrl, generatePreviewUrl } from '@/utilities/url/generate-preview-url'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { revalidatePod } from './hooks/revalidatePod'

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
    livePreview: {
      url: generateLivePreviewUrl('pods'),
    },
    preview: generatePreviewUrl('pods'),
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
}
