import { FriendlyError } from '@/utils/friendly-error';

export const uploadToBucket = async (signedUrl: string, file: File): Promise<void> => {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'x-goog-if-generation-match': '0',
    },
    body: file,
  });

  if (!res.ok) {
    throw new FriendlyError('Failed to upload to bucket');
  }
};
