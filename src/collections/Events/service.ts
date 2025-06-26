import type { Event } from '@/payload-types';
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs';
import dayjs from 'dayjs';
import PodAtEventService from '../PodsAtEvents/service';

/**
 * User-friendly interface for displaying event data.
 */
export default class EventService {
  readonly pods: PodAtEventService[];

  static async getBySlug(slug: string): Promise<EventService | null> {
    const events = await findDraftsOrPublicDocs({
      collection: 'events',
      where: {
        slug: { equals: slug },
      },
      limit: 2,
    });

    if (events.docs.length !== 1) {
      return null;
    }

    return new EventService(events.docs[0]);
  }

  constructor(protected readonly event: Event) {
    const rawPods = this.event.pods?.docs ?? [];

    this.pods = rawPods
      .filter((pod) => typeof pod !== 'number')
      .map((pod) => new PodAtEventService(pod));

    if (rawPods.length !== this.pods.length) {
      console.warn(`EventService(event: ${this.event.id}): Some pods were not resolved.`);
    }
  }

  get id(): number {
    return this.event.id;
  }

  get slug(): string {
    if (!this.event.slug) {
      throw new Error(`EventService(event: ${this.event.id}): Missing slug.`);
    }

    return this.event.slug;
  }

  get title(): string {
    return this.event.title;
  }

  get formattedDate(): string {
    return dayjs(this.event.date).format('MMMM D, YYYY');
  }

  get rawDate(): string {
    return this.event.date;
  }

  get hasPods(): boolean {
    return this.pods.length > 0;
  }

  get hasMorePods(): boolean {
    return this.event.pods?.hasNextPage ?? false;
  }
}
