'use client';

import { AuthView } from '@daveyplate/better-auth-ui';
import { useSearchParams } from 'next/navigation';

export const AuthViewWrapper = ({ path }: { path: string }) => {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? searchParams.get('redirect') ?? '/';

  return <AuthView path={path} redirectTo={redirectTo} />;
};
