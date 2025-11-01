import { FriendlyError } from './friendly-error';

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

/**
 * Ensures that any {@link FriendlyError}s thrown by the {@link callback}
 * are serialized into a {@link Result} object.
 */
export const pack = async <T>(callback: () => Promise<T>): Promise<Result<T>> => {
  try {
    return {
      success: true,
      data: await callback(),
    };
  } catch (error) {
    if (error instanceof FriendlyError) {
      return {
        success: false,
        error: error.message,
      };
    }

    throw error;
  }
};

/**
 * Unpacks a {@link Result} object into the data it contains.
 * Throws a {@link FriendlyError} if the result is not successful.
 */
export const unpack = async <T>(result: Promise<Result<T>>): Promise<T> => {
  const res = await result;
  if (!res.success) {
    throw new FriendlyError(res.error);
  }
  return res.data;
};
