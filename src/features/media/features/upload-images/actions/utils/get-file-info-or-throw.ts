import { destructFileName } from '@/utils/destruct-file-name';
import { FriendlyError } from '@/utils/friendly-error';
import { isUnsafeBip39Name } from '@/utils/generate-unsafe-bip39-name';

const supportedExtToMimeType: Record<string, string | undefined> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
};

export const getFileInfoOrThrow = (
  fileName: string,
): {
  baseName: string;
  ext: string;
  mimeType: string;
} => {
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

  return { baseName, ext, mimeType };
};
