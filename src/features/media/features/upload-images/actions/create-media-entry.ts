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
import { getCrowdsourcedGcsFile } from '../utils/get-crowdsourced-gcs-file';
import { getFileInfoOrThrow, supportedExtToMimeType } from '../utils/get-file-info-or-throw';
import { getGcsFileSizeOrThrow } from '../utils/get-gcs-file-size-or-throw';

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

  const dimensions = await getGcsFileSizeOrThrow(file);
  const inferredMimeType = dimensions.type ? supportedExtToMimeType[dimensions.type] : undefined;
  if (!inferredMimeType || inferredMimeType !== mimeType) {
    throw new FriendlyError(
      `MIME type mismatch for file '${fileName}': ${inferredMimeType} !== ${mimeType}`,
    );
  }

  const payload = await getPayload({ config: configPromise });
  const user = await getPayloadUser(payload);

  return await runTransaction(payload, async (req) => {
    const event = await payload.findByID({
      req,
      collection: 'events',
      id: eventId,
      // Enforce access control. In particular: pretend that unpublished events do not exist.
      overrideAccess: false,
    });

    const media = await payload.create({
      req,
      // Anyone should be able to use this endpoint, so access control is not enforced here.
      user: user,
      collection: 'media',
      data: {
        alt: `Picture of ${event.title}, ${dayjs(event.date).format('MMMM D, YYYY')}`,
        uploadedBy: user?.id ?? (await getOrCreateAnonUser(payload)),
        filename: fileName,
        filesize: Number(metadata.size),
        width: dimensions.width,
        height: dimensions.height,
        mimeType,
        prefix: mediaCrowdsourcedGcsPrefix,
      },
    });

    await payload.update({
      req,
      // Anyone should be able to use this endpoint, so access control is not enforced here.
      user: user,
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
