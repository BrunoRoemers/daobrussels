import PodAtEventService from '@/features/pods-at-events/pod-at-event-service';
import { findDraftsOrPublicDocs } from '@/features/previews/find-drafts-or-public-docs';
import type { Event } from '@/payload-types';
import dayjs from 'dayjs';
import MediaService from '../media/media-service';
import { slugOrPreviewIdEquals } from '../previews/slug-or-preview-id-equals';

/**
 * User-friendly interface for displaying event data.
 */
export default class EventService {
  readonly pods: PodAtEventService[];
  readonly images: MediaService[];

  static async getBySlug(slug: string): Promise<EventService | null> {
    const events = await findDraftsOrPublicDocs({
      collection: 'events',
      where: await slugOrPreviewIdEquals(slug),
      limit: 2,
    });

    if (events.docs.length !== 1) {
      return null;
    }

    return new EventService(events.docs[0]);
  }

  constructor(protected readonly event: Event) {
    this.pods = this.initPods();
    this.images = this.initImages();
  }

  protected initPods(): PodAtEventService[] {
    const rawPods = this.event.pods?.docs ?? [];

    const pods = rawPods
      .filter((pod) => typeof pod !== 'number')
      .map((pod) => new PodAtEventService(pod));

    if (pods.length !== rawPods.length) {
      console.warn(`EventService(event: ${this.event.id}): Some pods were not resolved.`);
    }

    return pods;
  }

  protected initImages(): MediaService[] {
    const rawImages = this.event.images ?? [];

    const images = rawImages
      .filter((image) => typeof image !== 'number')
      .map((image) => new MediaService(image));

    if (images.length !== rawImages.length) {
      console.warn(`EventService(event: ${this.event.id}): Some images were not resolved.`);
    }

    return images;
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

  get hasImages(): boolean {
    return this.images.length > 0;
  }
}
