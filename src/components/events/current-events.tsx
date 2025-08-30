import { findDraftsOrPublicDocs } from '@/features/draft-mode/find-drafts-or-public-docs';
import EventService from '@/features/events/event-service';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { EventCard } from './event-card';
import { NoUpcomingEventsCard } from './no-upcoming-events-card';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * This component shows events at (and around) the current date.
 */
const CurrentEvents = async () => {
  const today = dayjs().tz('Europe/Brussels');
  const todayStart = today.startOf('day').format();
  const todayEnd = today.endOf('day').format();

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
          hasMore={todayBatch.hasNextPage}
        />
      )}

      <EventSection
        title="Upcoming Events"
        events={upcomingBatch.docs.map((event) => new EventService(event))}
        hasMore={upcomingBatch.hasNextPage}
        empty={<NoUpcomingEventsCard />}
      />

      {pastBatch.docs.length > 0 && (
        <EventSection
          title="Past Events"
          events={pastBatch.docs.map((event) => new EventService(event))}
          hasMore={pastBatch.hasNextPage}
        />
      )}
    </div>
  );
};

export default CurrentEvents;

interface EventSectionProps {
  title: string;
  events: EventService[];
  hasMore: boolean;
  empty?: ReactNode;
}

const EventSection = ({ title, events, hasMore, empty }: EventSectionProps) => (
  <div className="mb-8">
    <h2 className="mb-4 text-2xl font-bold">{title}</h2>
    <div className="grid gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
      {events.length <= 0 && empty}
      {hasMore && <ViewMoreButton />}
    </div>
  </div>
);

const ViewMoreButton = () => {
  return (
    <Link href="/events" className="text-center">
      View more events
    </Link>
  );
};
