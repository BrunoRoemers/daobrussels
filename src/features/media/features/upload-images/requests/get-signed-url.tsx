import { FriendlyError } from '@/utils/friendly-error';
import z from 'zod';

const SignedUrlRes = z.object({
  url: z.string(),
});

type SignedUrlRes = z.infer<typeof SignedUrlRes>;

export const getSignedUrl = async (file: File): Promise<string> => {
  const res = await fetch('/api/storage-gcs-generate-signed-url', {
    method: 'POST',
    body: JSON.stringify({
      collectionSlug: 'media',
      filename: file.name,
      mimeType: file.type,
    }),
  });

  if (!res.ok) {
    throw new FriendlyError('Failed to get signed url');
  }

  return SignedUrlRes.parse(await res.json()).url;
};
