import { gcsStorage } from '@payloadcms/storage-gcs';
import { Plugin } from 'payload';

import { beforeSyncWithSearch } from '@/search/beforeSync';
import { searchFields } from '@/search/fieldOverrides';
import { searchPlugin } from '@payloadcms/plugin-search';
import { getGoogleCloudAuthClient } from 'infra/google-cloud/get-google-cloud-auth-client';

export const plugins: Plugin[] = [
  searchPlugin({
    collections: ['events'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields];
      },
    },
  }),
  gcsStorage({
    collections: {
      media: {
        prefix: 'collections/media',
      },
    },
    bucket: process.env.GCP_BUCKET_NAME || '',
    options: {
      projectId: process.env.GCP_PROJECT_ID || '',
      authClient: getGoogleCloudAuthClient(),
    },
    acl: 'Private',
    clientUploads: true,
  }),
];
