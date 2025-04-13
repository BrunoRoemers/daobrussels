import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import { z } from 'zod';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const path = z.string().startsWith('/').parse(searchParams.get('path'));

  const draft = await draftMode();

  const payload = await getPayload({ config: configPromise });
  const auth = await payload.auth({ headers: request.headers });

  // Only people with access to the admin panel can enable draft mode.
  // More importantly, the draft resource should enforce proper access control;
  // E.g. someone might be allowed to view drafts of events, but not of posts.
  if (!auth.permissions.canAccessAdmin) {
    draft.disable();
    return new Response('You are not allowed to preview this page', { status: 403 });
  }

  draft.enable();

  redirect(path);
}
