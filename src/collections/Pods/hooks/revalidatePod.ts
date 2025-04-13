import type { CollectionAfterChangeHook } from 'payload';

import type { Pod } from '@/payload-types';
import { revalidatePath } from 'next/cache';

export const revalidatePod: CollectionAfterChangeHook<Pod> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const paths = new Set<string>();

  if (doc._status === 'published') {
    paths.add(`/pods/${doc.slug}`);
  }

  if (previousDoc._status === 'published') {
    paths.add(`/pods/${previousDoc.slug}`);
  }

  if (paths.size > 0) {
    paths.add(`/pods`);
  }

  for (const path of paths) {
    payload.logger.info(`Revalidating page at path: ${path}`);
    revalidatePath(path);
  }

  return doc;
};
