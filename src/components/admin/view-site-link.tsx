'use client';

import { useWindow } from '@/features/shared/react-hooks/use-window';

export function ViewSiteLink() {
  const window = useWindow();

  return (
    <a href={window?.location.origin} target="_blank" style={{ textDecoration: 'none' }}>
      {window?.location.origin}
    </a>
  );
}
