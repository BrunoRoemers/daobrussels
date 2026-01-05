'use client';

import { useWindow } from '@/features/shared/react-hooks/use-window';
import { AuthView } from '@daveyplate/better-auth-ui';

export const AuthViewWrapper = ({ path }: { path: string }) => {
  const window = useWindow();
  const searchParams = new URLSearchParams(window?.location.search);
  const redirectTo = searchParams.get('redirectTo') ?? searchParams.get('redirect') ?? '/';

  return <AuthView path={path} redirectTo={redirectTo} />;
};
