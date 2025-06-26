import EventService from '@/collections/Events/service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dayjs from 'dayjs';
import Link from 'next/link';

export const EventCard = ({ event }: { event: EventService }) => (
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
