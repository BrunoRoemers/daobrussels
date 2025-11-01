'use server';

import { FriendlyError } from '@/utils/friendly-error';
import { pack, type Result } from '@/utils/pack-unpack-result';
import { toBytes } from '@/utils/to-bytes';
import { getCrowdsourcedGcsFile } from '../utils/get-crowdsourced-gcs-file';
import { getFileInfoOrThrow } from '../utils/get-file-info-or-throw';

const maxFileSize = '5mb';

export interface SignedUrlData {
  url: string;
  metadataHeaders: Record<string, string>;
}

export const getSignedUrl = async (
  fileName: string,
  fileSize: number,
): Promise<Result<SignedUrlData>> => {
  return pack(async () => {
    const { mimeType } = getFileInfoOrThrow(fileName);

    if (fileSize > toBytes(maxFileSize)) {
      throw new FriendlyError(`File larger than ${maxFileSize}`);
    }

    const metadataHeaders: Record<string, string> = {
      'Content-Length': fileSize.toString(),
      // Log which deployment did the upload.
      'x-goog-meta-source': `frontend@${process.env.VERCEL_DEPLOYMENT_ID ?? 'unknown'}`,
    };

    const [url] = await getCrowdsourcedGcsFile(fileName) //
      .getSignedUrl({
        action: 'write',
        contentType: mimeType,
        expires: Date.now() + 10 * 1000,
        version: 'v4',
        extensionHeaders: {
          // Prevent overwriting existing files.
          'x-goog-if-generation-match': '0',
          // File metadata.
          ...metadataHeaders,
        },
      });

    return { url, metadataHeaders };
  });
};
