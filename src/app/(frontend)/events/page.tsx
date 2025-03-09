import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const events = await payload.find({
    collection: 'events',
    draft,
    depth: 1,
    limit: 10,
    // FIXME(Bruno): Once we figure out how to be signed in on the frontend, we can respect access control
    overrideAccess: draft,
  })

  return (
    <div>
      <h1>Hello Events!</h1>
      <ul className="list-inside list-disc">
        {events.docs.map((event) => (
          <li key={event.id}>
            <Link href={`/events/${event.slug}`}>{event.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  }
}
