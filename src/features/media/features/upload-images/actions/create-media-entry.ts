'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { mediaCrowdsourcedGcsPrefix } from '@/features/media/media-collection';
import { getOrCreateAnonUser } from '@/features/shared/local-api/get-or-create-anon-user';
import { getPayloadUser } from '@/features/shared/local-api/get-payload-user';
import { runTransaction } from '@/features/shared/local-api/run-transaction';
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
  const user = await getPayloadUser(payload);

  await runTransaction(payload, async (req) => {
    const media = await payload.create({
      req,
      collection: 'media',
      data: {
        alt: 'lorem ipsum', // TODO
        uploadedBy: user?.id ?? (await getOrCreateAnonUser(payload)),
        filename: fileName,
        filesize: Number(metadata.size),
        width: 100, // TODO
        height: 100, // TODO
        mimeType,
        prefix: mediaCrowdsourcedGcsPrefix,
        // TODO mark file as waiting for approval
      },
    });

    const event = await payload.findByID({
      req,
      collection: 'events',
      id: eventId,
    });

    await payload.update({
      req,
      collection: 'events',
      id: eventId,
      data: {
        images: (event.images ?? []).concat(media.id),
      },
    });
  });
};
