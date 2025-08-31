import { PayloadAdminBar } from '@payloadcms/admin-bar';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { redirect } from 'next/navigation';

export const AdminBar = async () => {
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <PayloadAdminBar
      cmsURL={process.env.NEXT_PUBLIC_SERVER_URL}
      logo={<span>Dashboard</span>}
      style={{ position: 'relative' }}
      preview={isDraftModeEnabled}
      onPreviewExit={disableDraftMode}
    />
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
