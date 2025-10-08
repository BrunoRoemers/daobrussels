import type { Media } from '@/payload-types';

export default class MediaService {
  constructor(protected readonly media: Media) {}

  get url(): string {
    if (!this.media.url) {
      throw new Error(`MediaService(media: ${this.media.id}): Missing url.`);
    }

    return this.media.url;
  }

  get alt(): string {
    return this.media.alt;
  }

  get width(): number {
    if (!this.media.width) {
      throw new Error(`MediaService(media: ${this.media.id}): Missing width.`);
    }

    return this.media.width;
  }

  get height(): number {
    if (!this.media.height) {
      throw new Error(`MediaService(media: ${this.media.id}): Missing height.`);
    }

    return this.media.height;
  }
}
