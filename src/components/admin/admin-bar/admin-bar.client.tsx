'use client';

import { primaryUrl } from '@/features/shared/deployment-urls';
import { PayloadAdminBar } from '@payloadcms/admin-bar';
import { useSelectedLayoutSegments } from 'next/navigation';
import { useCollectionInfo } from './use-collection-info';

interface Props {
  isDraftModeEnabled: boolean;
  disableDraftMode: () => void;
}

export const AdminBarClient = ({ isDraftModeEnabled, disableDraftMode }: Props) => {
  const segments = useSelectedLayoutSegments();
  const collectionInfo = useCollectionInfo(segments);

  return (
    <>
      <PayloadAdminBar
        cmsURL={primaryUrl}
        logo={<span>Dashboard</span>}
        collectionSlug={collectionInfo?.collection}
        collectionLabels={collectionInfo?.collectionLabels}
        id={collectionInfo?.id}
        preview={isDraftModeEnabled}
        onPreviewExit={disableDraftMode}
        className="peer h-10"
        logoProps={openInSameTab}
        userProps={openInSameTab}
        editProps={openInSameTab}
        createProps={openInSameTab}
        previewProps={openInSameTab}
        logoutProps={openInSameTab}
      />
      {/* When the admin bar is shown, the page should be pushed down, so the admin bar doesn't cover it. */}
      <div className="hidden h-10 peer-[#payload-admin-bar]:block"></div>
    </>
  );
};

const openInSameTab = { target: undefined, rel: undefined };