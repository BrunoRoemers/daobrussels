import type { CollectionConfig } from 'payload';

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical';
import path from 'path';
import { fileURLToPath } from 'url';

import { anyone } from '../access/anyone';
import { authenticated } from '../access/authenticated';

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
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()];
        },
      }),
    },
  ],
  upload: {
    // NOTE: Payload can automatically generate different sizes of the image, but let's start with originals for now.
    //       https://payloadcms.com/docs/upload/overview
  },
};
