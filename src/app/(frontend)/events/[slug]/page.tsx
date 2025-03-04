import type { Metadata } from 'next/types'

import type { Event } from '@/payload-types'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

export const dynamic = 'force-static'
export const revalidate = 600

type Args = {
  params: Promise<{
    slug: string
  }>
}

export default async function Page({ params }: Args) {
  const { slug } = await params

  const event = await getEventBySlug(slug)

  return (
    <div>
      <h1>{event.title}</h1>
      <p>
        Ex cupidatat laborum ut duis labore laborum enim id ex consequat. Sint velit ea commodo
        nostrud ea laborum labore est nulla. Culpa et amet laborum. Ex aliquip minim aute cupidatat
        minim ut dolore culpa pariatur. Proident aute culpa aliqua proident ea ut id voluptate culpa
        Lorem nisi. Cillum esse sunt ut aute.
      </p>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  }
}

const getEventBySlug = async (slug: string): Promise<Event> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const events = await payload.find({
    collection: 'events',
    draft,
    where: {
      slug: { equals: slug },
    },
    limit: 2,
    // FIXME(Bruno): Once we figure out how to be signed in on the frontend, we can respect access control
    overrideAccess: draft,
  })

  if (events.docs.length !== 1) {
    return notFound()
  }

  return events.docs[0]
}
