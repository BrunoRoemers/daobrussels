import configPromise from '@payload-config';
import { draftMode, headers as nextHeaders } from 'next/headers';
import { getPayload, type BasePayload } from 'payload';

export const findDraftsOrPublicDocs: BasePayload['find'] = async (options) => {
  const payload = await getPayload({ config: configPromise });

  const { isEnabled } = await draftMode();

  return await payload.find({
    ...options,
    // Toggle draft mode.
    draft: isEnabled,
    // Enable access control.
    overrideAccess: false,
    // User to run the query as.
    user: isEnabled
      ? await getPayloadUser(payload) // dynamic rendering
      : undefined, // static rendering
  });
};

// NOTE: Reading the current user implies that the whole route is opted into dynamic rendering at request time.
//       Run `npm run build` to see whether a route is rendered at build time or on demand.
//       See: https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-apis
const getPayloadUser = async (payload: BasePayload) => {
  const headers = await nextHeaders();
  const auth = await payload.auth({ headers });
  return auth.user;
};
