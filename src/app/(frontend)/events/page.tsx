import EventService from '@/collections/Events/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs';
import dayjs from 'dayjs';
import Link from 'next/link';
import type { Metadata } from 'next/types';

export default async function Page() {
  const today = dayjs();
  const todayStart = today.startOf('day').toISOString();
  const todayEnd = today.endOf('day').toISOString();

  const [todayBatch, upcomingBatch, pastBatch] = await Promise.all([
    // Today's events
    findDraftsOrPublicDocs({
      collection: 'events',
      limit: 10,
      where: {
        date: {
          greater_than_equal: todayStart,
          less_than_equal: todayEnd,
        },
      },
      sort: 'date',
    }),
    // Upcoming events
    findDraftsOrPublicDocs({
      collection: 'events',
      limit: 10,
      where: {
        date: {
          greater_than: todayEnd,
        },
      },
      sort: 'date',
    }),

    // Past events
    findDraftsOrPublicDocs({
      collection: 'events',
      limit: 10,
      where: {
        date: {
          less_than: todayStart,
        },
      },
      sort: '-date',
    }),
  ]);

  return (
    <div className="container py-8">
      {todayBatch.docs.length > 0 && (
        <EventSection
          title="Happening Today"
          events={todayBatch.docs.map((event) => new EventService(event))}
        />
      )}

      {upcomingBatch.docs.length > 0 && (
        <EventSection
          title="Upcoming Events"
          events={upcomingBatch.docs.map((event) => new EventService(event))}
        />
      )}

      {pastBatch.docs.length > 0 && (
        <EventSection
          title="Past Events"
          events={pastBatch.docs.map((event) => new EventService(event))}
        />
      )}
    </div>
  );
}

const EventSection = ({ title, events }: { title: string; events: EventService[] }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);

const EventCard = ({ event }: { event: EventService }) => (
  <Link href={`/events/${event.slug}`} className="hover:text-primary transition-colors">
    <Card className="flex flex-col items-center md:flex-row gap-4 hover:shadow-md transition-shadow">
      <div className="md:w-1/4 bg-muted p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">{dayjs(event.rawDate).format('D')}</div>
          <div className="text-sm uppercase">{dayjs(event.rawDate).format('MMM')}</div>
          <div className="text-sm">{dayjs(event.rawDate).format('YYYY')}</div>
        </div>
      </div>
      <div className="md:w-3/4 p-4">
        <CardHeader className="p-0">
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <p className="text-muted-foreground">{dayjs(event.rawDate).format('h:mm A')}</p>
        </CardContent>
      </div>
    </Card>
  </Link>
);

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  };
}
