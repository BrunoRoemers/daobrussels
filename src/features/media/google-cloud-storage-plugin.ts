import { gcsStorage } from '@payloadcms/storage-gcs';
import { getGoogleCloudAuthClient } from 'infra/google-cloud/get-google-cloud-auth-client';
import { mediaGcsPrefix } from './media-collection';

export const GoogleCloudStorage = gcsStorage({
  collections: {
    media: {
      prefix: mediaGcsPrefix,
    },
  },
  bucket: process.env.GCP_BUCKET_NAME || '',
  options: {
    projectId: process.env.GCP_PROJECT_ID || '',
    authClient: getGoogleCloudAuthClient(),
  },
  acl: 'Private',
  clientUploads: {
    // TODO be more restrictive?
    access: authenticated,
  },
});
