import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EventService from '@/features/events/event-service';
import dayjs from 'dayjs';
import Link from 'next/link';

export const EventCard = ({ event }: { event: EventService }) => (
  <Link href={`/events/${event.slug}`} className="hover:text-primary transition-colors">
    <Card className="flex flex-col items-center gap-4 transition-shadow hover:shadow-md md:flex-row">
      <div className="bg-muted flex items-center justify-center p-4 md:w-1/4">
        <div className="text-center">
          <div className="text-2xl font-bold">{dayjs(event.rawDate).format('D')}</div>
          <div className="text-sm uppercase">{dayjs(event.rawDate).format('MMM')}</div>
          <div className="text-sm">{dayjs(event.rawDate).format('YYYY')}</div>
        </div>
      </div>
      <div className="p-4 md:w-3/4">
        <CardHeader className="p-0">
          <CardTitle>{event.title}</CardTitle>
        </CardHeader>
        <CardContent className="mt-2 p-0">
          <p className="text-muted-foreground">{dayjs(event.rawDate).format('h:mm A')}</p>
        </CardContent>
      </div>
    </Card>
  </Link>
);
