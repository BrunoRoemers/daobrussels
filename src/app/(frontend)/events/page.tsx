import EventService from '@/collections/Events/service';
import { EventCard } from '@/components/events/event-card';
import { Card, CardContent } from '@/components/ui/card';
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs';
import type { Metadata } from 'next/types';

export default async function Page() {
  const data = await findDraftsOrPublicDocs({
    collection: 'events',
    limit: 10,
    sort: '-date',
  });

  const events = data.docs.map((event) => new EventService(event));

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-bold mb-4">All Events</h2>
      <div className="grid gap-4">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
        {events.length === 0 && (
          <Card>
            <CardContent>No events found</CardContent>
          </Card>
        )}
        {/* TODO pagination  */}
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  };
}
