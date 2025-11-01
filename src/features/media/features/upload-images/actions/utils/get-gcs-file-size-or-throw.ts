import { FriendlyError } from '@/utils/friendly-error';
import { File } from '@google-cloud/storage';
import imageSize from 'image-size';
import type { ISizeCalculationResult } from 'image-size/types/interface';

export const getGcsFileSizeOrThrow = async (file: File): Promise<ISizeCalculationResult> => {
  const stream = file.createReadStream();

  let buffer = Buffer.alloc(0);
  for await (const chunk of stream) {
    buffer = Buffer.concat([buffer, chunk]);

    try {
      // Return early if the image dimensions are found,
      // which cancels the stream to reduce bandwidth and memory usage.
      return imageSize(buffer);
    } catch (e) {
      // If the dimensions are not found, continue the stream.
    }
  }

  throw new FriendlyError('Could not extract dimensions from file');
};
