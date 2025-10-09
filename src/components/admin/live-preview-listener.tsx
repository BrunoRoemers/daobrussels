'use client';
import { primaryUrl } from '@/features/shared/deployment-urls';
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

export const LivePreviewListener = () => {
  const router = useRouter();
  return <RefreshRouteOnSave refresh={router.refresh} serverURL={primaryUrl} />;
};
