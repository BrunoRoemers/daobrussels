import type { Payload, PayloadRequest } from 'payload';

export const runTransaction = async <R>(
  payload: Payload,
  fn: (req: Pick<PayloadRequest, 'transactionID'>) => Promise<R>,
): Promise<R> => {
  const transactionID = await payload.db.beginTransaction();
  if (!transactionID) {
    throw new Error('Failed to begin transaction');
  }

  try {
    const result = await fn({ transactionID });
    await payload.db.commitTransaction(transactionID);
    return result;
  } catch (error) {
    await payload.db.rollbackTransaction(transactionID);
    throw error;
  }
};
