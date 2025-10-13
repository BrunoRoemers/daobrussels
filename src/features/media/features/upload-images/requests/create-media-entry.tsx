import { Media, mediaGcsPrefix } from '@/features/media/media-collection';
import { FriendlyError } from '@/utils/friendly-error';

export const createMediaEntry = async (file: File): Promise<void> => {
  const formData = new FormData();

  formData.append(
    '_payload',
    JSON.stringify({
      alt: file.name,
    }),
  );

  formData.append(
    'file',
    JSON.stringify({
      clientUploadContext: { prefix: mediaGcsPrefix },
      collectionSlug: Media.slug,
      filename: file.name,
      mimeType: file.type,
      size: file.size,
    }),
  );

  const res = await fetch(`/api/${Media.slug}`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new FriendlyError(`Failed to create ${Media.slug} entry`);
  }
};
