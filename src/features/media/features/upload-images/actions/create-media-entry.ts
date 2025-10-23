'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { mediaCrowdsourcedGcsPrefix } from '@/features/media/media-collection';
import { FriendlyError } from '@/utils/friendly-error';
import { getCrowdsourcedGcsFile } from './utils/get-crowdsourced-gcs-file';
import { getFileInfoOrThrow } from './utils/get-file-info-or-throw';

export const createMediaEntry = async (fileName: string): Promise<void> => {
  const { mimeType } = getFileInfoOrThrow(fileName);

  const file = getCrowdsourcedGcsFile(fileName);
  const [fileExists] = await file.exists();
  if (!fileExists) {
    throw new FriendlyError(`File '${fileName}' does not exist`);
  }

  const [metadata] = await file.getMetadata();

  const payload = await getPayload({ config: configPromise });
  // TODO if the user is logged in, give them credit in one go

  await payload.create({
    collection: 'media',
    data: {
      alt: 'lorem ipsum', // TODO
      filename: fileName,
      filesize: Number(metadata.size),
      mimeType,
      prefix: mediaCrowdsourcedGcsPrefix,
      // TODO mark file as waiting for approval
    },
  });
};
