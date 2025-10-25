'use server';

import configPromise from '@payload-config';
import { getPayload } from 'payload';

import { mediaCrowdsourcedGcsPrefix } from '@/features/media/media-collection';
import { getId } from '@/features/shared/local-api/get-id';
import { getOrCreateAnonUser } from '@/features/shared/local-api/get-or-create-anon-user';
import { getPayloadUser } from '@/features/shared/local-api/get-payload-user';
import { runTransaction } from '@/features/shared/local-api/run-transaction';
import { FriendlyError } from '@/utils/friendly-error';
import dayjs from 'dayjs';
import { getCrowdsourcedGcsFile } from './utils/get-crowdsourced-gcs-file';
import { getFileInfoOrThrow } from './utils/get-file-info-or-throw';

interface Result {
  approvedBy: number | undefined;
}

export const createMediaEntry = async (fileName: string, eventId: number): Promise<Result> => {
  const { mimeType } = getFileInfoOrThrow(fileName);

  const file = getCrowdsourcedGcsFile(fileName);
  const [fileExists] = await file.exists();
  if (!fileExists) {
    throw new FriendlyError(`File '${fileName}' does not exist`);
  }

  const [metadata] = await file.getMetadata();
  if (metadata.contentType !== mimeType) {
    throw new FriendlyError(
      `MIME type mismatch for file '${fileName}': ${metadata.contentType} !== ${mimeType}`,
    );
  }

  const payload = await getPayload({ config: configPromise });
  const user = await getPayloadUser(payload);

  return await runTransaction(payload, async (req) => {
    const event = await payload.findByID({
      req,
      collection: 'events',
      id: eventId,
    });

    const media = await payload.create({
      req,
      user: user,
      collection: 'media',
      data: {
        alt: `Picture of ${event.title}, ${dayjs(event.date).format('MMMM D, YYYY')}`,
        uploadedBy: user?.id ?? (await getOrCreateAnonUser(payload)),
        filename: fileName,
        filesize: Number(metadata.size),
        width: 100, // TODO
        height: 100, // TODO
        mimeType,
        prefix: mediaCrowdsourcedGcsPrefix,
      },
    });

    await payload.update({
      req,
      collection: 'events',
      id: eventId,
      data: {
        images: (event.images ?? []).concat(media.id),
      },
    });

    return {
      approvedBy: getId(media.approvedBy),
    };
  });
};
