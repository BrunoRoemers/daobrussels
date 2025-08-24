import { gcsStorage } from '@payloadcms/storage-gcs';
import { getGoogleCloudAuthClient } from 'infra/google-cloud/get-google-cloud-auth-client';

export const GoogleCloudStorage = gcsStorage({
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
});
