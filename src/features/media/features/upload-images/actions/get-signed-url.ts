'use server';

import { getCrowdsourcedGcsFile } from '../utils/get-crowdsourced-gcs-file';
import { getFileInfoOrThrow } from '../utils/get-file-info-or-throw';

export interface SignedUrlResult {
  url: string;
  metadataHeaders: Record<string, string>;
}

export const getSignedUrl = async (fileName: string): Promise<SignedUrlResult> => {
  const { mimeType } = getFileInfoOrThrow(fileName);

  const metadataHeaders: Record<string, string> = {
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
};
