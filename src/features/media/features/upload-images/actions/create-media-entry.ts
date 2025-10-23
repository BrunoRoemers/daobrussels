'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { mediaGcsPrefix } from '@/features/media/media-collection';
import { getFileInfoOrThrow } from './utils/get-file-info-or-throw';

export const createMediaEntry = async (fileName: string): Promise<void> => {
  const { baseName, ext, mimeType } = getFileInfoOrThrow(fileName);

  const payload = await getPayload({ config: configPromise });
  // TODO if the user is logged in, give them credit in one go

  await payload.create({
    collection: 'media',
    data: {
      alt: 'lorem ipsum', // TODO
      filename: `${baseName}.${ext}`,
      mimeType,
      prefix: mediaGcsPrefix,
      // TODO mark file as waiting for approval
    },
  });
};
