import { cn } from '@/utils/cn';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import type { Event } from '@/payload-types';
import Link from 'next/link';

export type Props = {
  events: Event[];
};

export const CollectionArchive = (props: Props) => {
  const { events } = props;

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-4 sm:grid-cols-8 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-8 xl:gap-x-8">
          {events.map((event) => {
            return (
              <Link href={`/events/${event.slug}`} className="col-span-4" key={event.id}>
                <Card>
                  <CardHeader className="gap-0">
                    <CardTitle>{event.title}</CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
