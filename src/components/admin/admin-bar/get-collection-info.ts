import { formatQueryUrl } from '@/utilities/format-query-url';

export interface CollectionInfo {
  collection: string;
  collectionLabels: {
    plural: string;
    singular: string;
  };
  id?: {
    fetchKey: string;
    extractId: (data: any) => string | undefined;
  };
}

export const getCollectionInfo = (segments: string[]): CollectionInfo | undefined => {
  switch (segments[0]) {
    case 'events':
      return {
        collection: 'events',
        collectionLabels: {
          plural: 'Events',
          singular: 'Event',
        },
        id: maybeGetIdFromSlug('events', segments[1]),
      };
  }
};

const maybeGetIdFromSlug = (
  collection: string,
  slug: string | undefined,
): CollectionInfo['id'] | undefined => {
  if (!slug) {
    return undefined;
  }

  return {
    fetchKey: formatQueryUrl(`/api/${collection}`, {
      where: { slug: { equals: slug } },
      select: { id: true },
    }),
    extractId: (data) => data?.docs?.[0]?.id,
  };
};
