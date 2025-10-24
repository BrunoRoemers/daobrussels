'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { mediaCrowdsourcedGcsPrefix } from '@/features/media/media-collection';
import { FriendlyError } from '@/utils/friendly-error';
import { getCrowdsourcedGcsFile } from './utils/get-crowdsourced-gcs-file';
import { getFileInfoOrThrow } from './utils/get-file-info-or-throw';

export const createMediaEntry = async (fileName: string, eventId: number): Promise<void> => {
  const { mimeType } = getFileInfoOrThrow(fileName);

  const file = getCrowdsourcedGcsFile(fileName);
  const [fileExists] = await file.exists();
  if (!fileExists) {
    throw new FriendlyError(`File '${fileName}' does not exist`);
  }

  const [metadata] = await file.getMetadata();

  const payload = await getPayload({ config: configPromise });
  // TODO if the user is logged in, give them credit in one go

  const media = await payload.create({
    collection: 'media',
    data: {
      alt: 'lorem ipsum', // TODO
      filename: fileName,
      filesize: Number(metadata.size),
      width: 100, // TODO
      height: 100, // TODO
      mimeType,
      prefix: mediaCrowdsourcedGcsPrefix,
      // TODO mark file as waiting for approval
    },
  });

  await payload.update({
    collection: 'events',
    id: eventId,
    data: {
      images: [media.id], // TODO prevent overwriting existing images
    },
  });
};
