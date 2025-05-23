import type { Metadata } from 'next/types';

import { CollectionArchive } from '@/components/CollectionArchive';
import type { Event } from '@/payload-types';
import { Search } from '@/search/Component';
import configPromise from '@payload-config';
import { getPayload } from 'payload';

type Args = {
  searchParams: Promise<{
    q: string;
  }>;
};
export default async function Page({ searchParams: searchParamsPromise }: Args) {
  const { q: query } = await searchParamsPromise;
  const payload = await getPayload({ config: configPromise });

  const posts = await payload.find({
    collection: 'search',
    depth: 1,
    limit: 12,
    ...(query
      ? {
          where: {
            or: [
              {
                title: {
                  like: query,
                },
              },
              {
                'meta.description': {
                  like: query,
                },
              },
              {
                'meta.title': {
                  like: query,
                },
              },
              {
                slug: {
                  like: query,
                },
              },
            ],
          },
        }
      : {}),
  });

  return (
    <div className="pt-24 pb-24">
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="sr-only">Search</h1>
          <Search />
        </div>
      </div>

      {posts.totalDocs > 0 ? (
        <CollectionArchive events={posts.docs as unknown as Event[]} />
      ) : (
        <div className="container">No results found.</div>
      )}
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Search`,
  };
}
