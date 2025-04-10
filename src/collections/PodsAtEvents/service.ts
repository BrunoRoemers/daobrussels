import type { Pod, PodAtEvent, User } from '@/payload-types';

/**
 * User-friendly interface for displaying the data of a pod at an event.
 */
export default class PodAtEventService {
  // TODO expose service instead of raw data
  readonly pod: Pod | undefined;

  // TODO expose service instead of raw data
  readonly host: User | undefined;

  constructor(protected readonly podAtEvent: PodAtEvent) {
    if (typeof podAtEvent.host !== 'number') {
      this.host = podAtEvent.host;
    } else {
      console.warn(`PodAtEventService(pod: ${podAtEvent.id}): Host was not resolved.`);
    }

    if (typeof podAtEvent.pod !== 'number') {
      this.pod = podAtEvent.pod;
    } else {
      console.warn(`PodAtEventService(pod: ${podAtEvent.id}): Pod was not resolved.`);
    }
  }

  get title(): string {
    return this.pod?.title ?? '';
  }

  get description(): string {
    return this.podAtEvent.description;
  }
}
