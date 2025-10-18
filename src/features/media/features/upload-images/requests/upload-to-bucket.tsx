import { FriendlyError } from '@/utils/friendly-error';
import type { SignedUrlResult } from '../actions';

export const uploadToBucket = async (signedUrl: SignedUrlResult, file: File): Promise<void> => {
  const { url, metadataHeaders } = signedUrl;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'x-goog-if-generation-match': '0',
      ...metadataHeaders,
    },
    body: file,
  });

  if (!res.ok) {
    throw new FriendlyError('Failed to upload to bucket');
  }
};
