import { FriendlyError } from '@/utils/friendly-error';

export const uploadToBucket = async (signedUrl: string, file: File): Promise<void> => {
  const res = await fetch(signedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!res.ok) {
    throw new FriendlyError('Failed to upload to bucket');
  }
};
