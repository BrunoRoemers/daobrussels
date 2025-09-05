import { fetcher } from '@/utils/fetcher';
import { formatQueryUrl } from '@/utils/format-query-url';
import useSWR from 'swr';

export interface CollectionInfo {
  collection: string;
  collectionLabels: {
    plural: string;
    singular: string;
  };
  id?: string;
}

export const useCollectionInfo = (segments: string[]): CollectionInfo | undefined => {
  const collectionInfo = getCollectionInfo(segments);
  const { data } = useSWR(collectionInfo?.id?.fetchKey, fetcher);
  const id = collectionInfo?.id?.extractId(data);
  return !collectionInfo ? undefined : { ...collectionInfo, id };
};

type IdFetcher = {
  fetchKey: string;
  extractId: (data: any) => string | undefined;
};

type InternalCollectionInfo = Omit<CollectionInfo, 'id'> & { id?: IdFetcher };

const getCollectionInfo = (segments: string[]): InternalCollectionInfo | undefined => {
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
): IdFetcher | undefined => {
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
