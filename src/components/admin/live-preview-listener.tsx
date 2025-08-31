'use client';
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

export const LivePreviewListener = () => {
  const router = useRouter();
  return (
    <RefreshRouteOnSave refresh={router.refresh} serverURL={process.env.NEXT_PUBLIC_SERVER_URL} />
  );
};
