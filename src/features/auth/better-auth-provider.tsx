'use client';

import { AuthUIProvider } from '@daveyplate/better-auth-ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authClient } from './better-auth-client';

interface Props {
  children: React.ReactNode;
}

export const BetterAuthProvider = ({ children }: Props) => {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={router.refresh}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
};
