import type { CollectionConfig } from 'payload';

import { anyone } from '@/features/auth/access-filters/anyone';
import { authenticated } from '@/features/auth/access-filters/authenticated';
import { role } from '../auth/access-filters/role';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
    {
      name: 'uploadedBy',
      type: 'relationship',
      relationTo: 'users',
      defaultValue: ({ user }) => user?.id,
      required: true,
      access: {
        // read-only
        create: role('admin'),
        update: role('admin'),
      },
      admin: {
        allowEdit: false,
        appearance: 'drawer',
      },
    },
    {
      name: 'events',
      type: 'join',
      collection: 'events',
      on: 'images',
      hasMany: true,
      admin: {
        allowCreate: false,
        defaultColumns: ['title', 'date', 'updatedAt'],
      },
    },
  ],
  upload: {
    // Needed by the frontend image upload feature.
    filesRequiredOnCreate: false,
    // NOTE: Payload can automatically generate different sizes of the image, but let's start with originals for now.
    //       https://payloadcms.com/docs/upload/overview
  },
};

export const mediaGcsPrefix = `collections/${Media.slug}`;
export const mediaCrowdsourcedGcsPrefix = `${mediaGcsPrefix}/crowdsourced`;
