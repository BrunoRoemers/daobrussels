import type { Metadata } from 'next/types';

import EventService from '@/collections/Events/service';
import { findDraftsOrPublicDocs } from '@/utilities/draft-mode/find-drafts-or-public-docs';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { PodList } from './pod-list';

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise });
  const events = await payload.find({
    collection: 'events',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  });

  const params = events.docs.map(({ slug }) => {
    return { slug };
  });

  return params;
}

type Args = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function Page({ params }: Args) {
  const { slug } = await params;

  const event = await getEventBySlug(slug);

  // FIXME(Bruno): Using `notFound` throws an error, which means `revalidatePath` will reattempt to generate the page, which results in an infinite loop...
  //               https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#handling-uncaught-exceptions
  if (!event) {
    return <div>not found</div>;
  }

  return (
    <div className="container pb-8">
      <h1>{event.title}</h1>
      <div>{event.formattedDate}</div>
      <p>
        Ex cupidatat laborum ut duis labore laborum enim id ex consequat. Sint velit ea commodo
        nostrud ea laborum labore est nulla. Culpa et amet laborum. Ex aliquip minim aute cupidatat
        minim ut dolore culpa pariatur. Proident aute culpa aliqua proident ea ut id voluptate culpa
        Lorem nisi. Cillum esse sunt ut aute.
      </p>
      <div className="mt-4">
        <PodList event={event} />
      </div>
    </div>
  );
}

export function generateMetadata(): Metadata {
  return {
    title: `Events by DAO Brussels`,
  };
}

const getEventBySlug = async (slug: string): Promise<EventService | null> => {
  const events = await findDraftsOrPublicDocs({
    collection: 'events',
    where: {
      slug: { equals: slug },
    },
    limit: 2,
    // NOTE: `populate` could help reduce the amount of data returned
  });

  if (events.docs.length !== 1) {
    return null;
  }

  return new EventService(events.docs[0]);
};
