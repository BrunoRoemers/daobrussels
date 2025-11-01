import { gcsStorageOptions } from '@/features/media/google-cloud-storage-plugin';
import { mediaCrowdsourcedGcsPrefix } from '@/features/media/media-collection';
import { File, Storage } from '@google-cloud/storage';

export const getCrowdsourcedGcsFile = (fileName: string): File => {
  const storageClient = new Storage(gcsStorageOptions.options);

  return storageClient
    .bucket(gcsStorageOptions.bucket)
    .file(`${mediaCrowdsourcedGcsPrefix}/${fileName}`);
};
