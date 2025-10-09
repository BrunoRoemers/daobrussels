'use client';

import { useWindow } from '@/features/shared/react-hooks/use-window';

export function ViewSiteLink() {
  const window = useWindow();

  return (
    <a href={window?.location.origin} style={{ textDecoration: 'none' }}>
      {window?.location.origin}
    </a>
  );
}
