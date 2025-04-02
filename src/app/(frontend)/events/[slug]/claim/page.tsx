import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs'
import dayjs from 'dayjs'
import ClaimButton from './claim-button'

type Props = {
  params: {
    slug: string
  }
}

export default async function ClaimPage({ params }: Props) {
  const { slug } = params

  const events = await findDraftsOrPublicDocs({
    collection: 'events',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })

  const event = events.docs[0]

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{event.title}</CardTitle>
          <CardDescription className="text-base">
            {dayjs(event.date).format('MMMM D, YYYY')}
          </CardDescription>
          <CardDescription className="text-base mt-2">
            Enter something that you will remember (email, phone number, wallet address, etc.). For
            privacy, this will be hashed before being sent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClaimButton eventTitle={event.title} />
        </CardContent>
      </Card>
    </div>
  )
}
