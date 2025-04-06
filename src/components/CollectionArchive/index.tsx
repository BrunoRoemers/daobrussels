import React from 'react';
import { cn } from 'src/utilities/cn';

import type { Event } from '@/payload-types';

import { Card } from '@/components/Card';

export type Props = {
  events: Event[];
};

export const CollectionArchive: React.FC<Props> = (props) => {
  const { events } = props;

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {events?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo="events" showCategories />
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
};
