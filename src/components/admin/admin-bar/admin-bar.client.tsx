'use client';

import { fetcher } from '@/utilities/fetcher';
import { PayloadAdminBar } from '@payloadcms/admin-bar';
import { useSelectedLayoutSegments } from 'next/navigation';
import useSWR from 'swr';
import { getCollectionInfo } from './get-collection-info';

interface Props {
  isDraftModeEnabled: boolean;
  disableDraftMode: () => void;
}

export const AdminBarClient = ({ isDraftModeEnabled, disableDraftMode }: Props) => {
  const segments = useSelectedLayoutSegments();
  const collectionInfo = getCollectionInfo(segments);
  const { data } = useSWR(collectionInfo?.id?.fetchKey, fetcher);
  const id = collectionInfo?.id?.extractId(data);

  return (
    <>
      <PayloadAdminBar
        cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
        logo={<span>Dashboard</span>}
        collectionSlug={collectionInfo?.collection}
        collectionLabels={collectionInfo?.collectionLabels}
        id={id}
        preview={isDraftModeEnabled}
        onPreviewExit={disableDraftMode}
        className="peer h-10"
      />
      {/* When the admin bar is shown, the page should be pushed down, so the admin bar doesn't cover it. */}
      <div className="hidden h-10 peer-[#payload-admin-bar]:block"></div>
    </>
  );
};
