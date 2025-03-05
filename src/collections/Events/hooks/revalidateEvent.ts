import type { CollectionAfterChangeHook } from 'payload'

import type { Event } from '@/payload-types'
import { revalidatePath } from 'next/cache'

export const revalidateEvent: CollectionAfterChangeHook<Event> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const paths = new Set<string>()

  if (doc._status === 'published') {
    paths.add(`/events/${doc.slug}`)
  }

  if (previousDoc._status === 'published') {
    paths.add(`/events/${previousDoc.slug}`)
  }

  if (paths.size > 0) {
    paths.add(`/events`)
  }

  for (const path of paths) {
    payload.logger.info(`Revalidating page at path: ${path}`)
    revalidatePath(path)
  }

  return doc
}
