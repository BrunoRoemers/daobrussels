import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs';
import dayjs from 'dayjs';
import Link from 'next/link';
import type { Metadata } from 'next/types';

export default async function Page() {
  // TODO three queries to better control the number of events shown
  const events = await findDraftsOrPublicDocs({
    collection: 'events',
    depth: 1,
    limit: 20,
  });

  const today = dayjs();
  const todayEvents = events.docs.filter((event) => dayjs(event.date).isSame(today, 'day'));
  const upcomingEvents = events.docs.filter((event) => dayjs(event.date).isAfter(today, 'day'));
  const pastEvents = events.docs.filter((event) => dayjs(event.date).isBefore(today, 'day'));

  return (
    <div className="container py-8">
      {todayEvents.length > 0 && <EventSection title="Happening Today" events={todayEvents} />}

      {upcomingEvents.length > 0 && (
        <EventSection title="Upcoming Events" events={upcomingEvents} />
      )}

      {pastEvents.length > 0 && <EventSection title="Past Events" events={pastEvents} />}

      {events.docs.length === 0 && <p className="text-muted-foreground">No events found.</p>}
    </div>
  );
}

const EventSection = ({ title, events }: { title: string; events: any[] }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  </div>
);

const EventCard = ({ event }: { event: any }) => (
  <Card className="flex flex-col items-center md:flex-row gap-4 hover:shadow-md transition-shadow">
    <div className="md:w-1/4 bg-muted p-4 flex items-center justify-center">
      <div className="text-center">
        <div className="text-2xl font-bold">{dayjs(event.date).format('D')}</div>
        <div className="text-sm uppercase">{dayjs(event.date).format('MMM')}</div>
        <div className="text-sm">{dayjs(event.date).format('YYYY')}</div>
      </div>
    </div>
    <div className="md:w-3/4 p-4">
      <CardHeader className="p-0">
        <CardTitle>
          {/* TODO make entire card clickable */}
          <Link href={`/events/${event.slug}`} className="hover:text-primary transition-colors">
            {event.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 mt-2">
        <p className="text-muted-foreground">{dayjs(event.date).format('h:mm A')}</p>
      </CardContent>
    </div>
  </Card>
);

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  };
}
