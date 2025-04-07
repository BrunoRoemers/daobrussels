import type { Event } from '@/payload-types';
import dayjs from 'dayjs';
import PodAtEventService from '../PodsAtEvents/service';

/**
 * User-friendly interface for displaying event data.
 */
export default class EventService {
  readonly pods: PodAtEventService[];

  constructor(protected readonly event: Event) {
    const rawPods = this.event.pods?.docs ?? [];

    this.pods = rawPods
      .filter((pod) => typeof pod !== 'number')
      .map((pod) => new PodAtEventService(pod));

    if (rawPods.length !== this.pods.length) {
      console.warn(`EventService(event: ${this.event.id}): Some pods were not resolved.`);
    }
  }

  get title(): string {
    return this.event.title;
  }

  get formattedDate(): string {
    return dayjs(this.event.date).format('MMMM D, YYYY');
  }

  get hasPods(): boolean {
    return this.pods.length > 0;
  }

  get hasMorePods(): boolean {
    return this.event.pods?.hasNextPage ?? false;
  }
}
