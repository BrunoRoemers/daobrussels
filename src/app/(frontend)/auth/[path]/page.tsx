import { authViewPaths } from '@daveyplate/better-auth-ui/server';
import { AuthViewWrapper } from './auth-view-wrapper';

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  return (
    <main className="flex grow items-center justify-center">
      <AuthViewWrapper path={path} />
    </main>
  );
}
