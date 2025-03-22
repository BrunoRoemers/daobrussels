import type { Metadata } from 'next/types'

import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs'
import Link from 'next/link'

export default async function Page() {
  const events = await findDraftsOrPublicDocs({
    collection: 'events',
    depth: 1,
    limit: 10,
  })

  return (
    <div className="container pb-8">
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
