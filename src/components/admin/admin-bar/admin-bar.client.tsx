'use client';

import { PayloadAdminBar } from '@payloadcms/admin-bar';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useCollectionInfo } from './use-collection-info';

interface Props {
  serverUrl: string;
  isDraftModeEnabled: boolean;
  disableDraftMode: () => void;
}

export const AdminBarClient = ({ serverUrl, isDraftModeEnabled, disableDraftMode }: Props) => {
  const segments = useSelectedLayoutSegments();
  const collectionInfo = useCollectionInfo(segments);

  return (
    <>
      <PayloadAdminBar
        cmsURL={serverUrl}
        logo={<span>Dashboard</span>}
        collectionSlug={collectionInfo?.collection}
        collectionLabels={collectionInfo?.collectionLabels}
        id={collectionInfo?.id}
        preview={isDraftModeEnabled}
        onPreviewExit={disableDraftMode}
        className="peer h-10"
      />
      {/* When the admin bar is shown, the page should be pushed down, so the admin bar doesn't cover it. */}
      <div className="hidden h-10 peer-[#payload-admin-bar]:block"></div>
    </>
  );
};
