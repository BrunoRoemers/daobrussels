import type { CollectionConfig } from 'payload';

import path from 'path';
import { fileURLToPath } from 'url';

import { anyone } from '@/features/auth/access-filters/anyone';
import { authenticated } from '@/features/auth/access-filters/authenticated';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

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
  ],
  upload: {
    // NOTE: Payload can automatically generate different sizes of the image, but let's start with originals for now.
    //       https://payloadcms.com/docs/upload/overview
  },
};
