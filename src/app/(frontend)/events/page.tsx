import { EventCard } from '@/components/events/event-card';
import { Pagination } from '@/components/pagination/pagination';
import { Card, CardContent } from '@/components/ui/card';
import EventService from '@/features/events/event-service';
import { findDraftsOrPublicDocs } from '@/features/previews/find-drafts-or-public-docs';
import type { Metadata } from 'next/types';

interface Props {
  searchParams: Promise<{
    page: string | undefined;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const { page = '1' } = await searchParams;

  const data = await findDraftsOrPublicDocs({
    collection: 'events',
    limit: 10,
    page: Number(page),
    sort: '-date',
  });

  const events = data.docs.map((event) => new EventService(event));

  return (
    <div className="container mx-auto py-8">
      <h2 className="mb-4 text-2xl font-bold">All Events</h2>
      <div className="grid gap-4">
        {events.length <= 0 ? (
          <Card>
            <CardContent>No events found</CardContent>
          </Card>
        ) : (
          <>
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
            <Pagination data={data} url={(page) => `/events?page=${page}`} />
          </>
        )}
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  };
}
