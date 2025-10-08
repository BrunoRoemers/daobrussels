'use client';
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react';
import { useRouter } from 'next/navigation';

interface Props {
  serverUrl: string;
}

export const LivePreviewListener = ({ serverUrl }: Props) => {
  const router = useRouter();
  return <RefreshRouteOnSave refresh={router.refresh} serverURL={serverUrl} />;
};
