import { PayloadAdminBar } from '@payloadcms/admin-bar';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { redirect } from 'next/navigation';

export const AdminBar = async () => {
  const { isEnabled: isDraftModeEnabled } = await draftMode();

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

const disableDraftMode = async () => {
  'use server';

  // Disable draft mode.
  const draft = await draftMode();
  draft.disable();

  // Refresh the page.
  const headers = await nextHeaders();
  redirect(headers.get('referer') || '/');
};
