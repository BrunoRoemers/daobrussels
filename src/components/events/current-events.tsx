import EventService from '@/collections/Events/service';
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs';
import dayjs from 'dayjs';
import { EventCard } from './event-card';

/**
 * This component shows events at (and around) the current date.
 */
const CurrentEvents = async () => {
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
};

export default CurrentEvents;

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
