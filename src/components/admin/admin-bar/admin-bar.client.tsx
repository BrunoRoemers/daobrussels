'use client';

import { PayloadAdminBar } from '@payloadcms/admin-bar';

interface Props {
  isDraftModeEnabled: boolean;
  disableDraftMode: () => void;
}

export const AdminBarClient = ({ isDraftModeEnabled, disableDraftMode }: Props) => {
  return (
    <>
      <PayloadAdminBar
        cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
        logo={<span>Dashboard</span>}
        preview={isDraftModeEnabled}
        onPreviewExit={disableDraftMode}
        className="peer h-10"
      />
      {/* When the admin bar is shown, the page should be pushed down, so the admin bar doesn't cover it. */}
      <div className="hidden h-10 peer-[#payload-admin-bar]:block"></div>
    </>
  );
};
