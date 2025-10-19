'use server';

import { destructFileName } from '@/utils/destruct-file-name';
import { FriendlyError } from '@/utils/friendly-error';
import { isUnsafeBip39Name } from '@/utils/generate-unsafe-bip39-name';
import { Storage } from '@google-cloud/storage';
import { gcsStorageOptions } from '../../../google-cloud-storage-plugin';
import { mediaGcsPrefix } from '../../../media-collection';

const supportedExtToMimeType: Record<string, string | undefined> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

export interface SignedUrlResult {
  url: string;
  metadataHeaders: Record<string, string>;
}

export const getSignedUrl = async (fileName: string): Promise<SignedUrlResult> => {
  const { baseName, ext } = destructFileName(fileName);

  // Enforce the word-word-word format, which also rejects monkey business like `/` or `../`.
  if (!isUnsafeBip39Name(baseName)) {
    throw new FriendlyError(`File name '${fileName}' does not match the expected format.`);
  }

  // Restrict the accepted file extensions, and force the corresponding mime type.
  const mimeType = supportedExtToMimeType[ext];
  if (!mimeType) {
    throw new FriendlyError(`File name '${fileName}' has invalid extension '.${ext}'.`);
  }

  const fileKey = `${mediaGcsPrefix}/crowdsourced/${baseName}.${ext}`;

  const storageClient = new Storage(gcsStorageOptions.options);

  const metadataHeaders: Record<string, string> = {
    // Log which deployment did the upload.
    'x-goog-meta-source': `frontend@${process.env.VERCEL_DEPLOYMENT_ID ?? 'unknown'}`,
  };

  const [url] = await storageClient
    .bucket(gcsStorageOptions.bucket)
    .file(fileKey)
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
