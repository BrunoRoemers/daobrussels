import { draftMode, headers as nextHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { AdminBarClient } from './admin-bar.client';

export const AdminBarServer = async () => {
  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return (
    <AdminBarClient isDraftModeEnabled={isDraftModeEnabled} disableDraftMode={disableDraftMode} />
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
