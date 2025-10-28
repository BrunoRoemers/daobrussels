import configPromise from '@payload-config';
import { draftMode } from 'next/headers';
import { getPayload, type BasePayload } from 'payload';
import { getPayloadUser } from '../shared/local-api/get-payload-user';

export const findDraftsOrPublicDocs: BasePayload['find'] = async (options) => {
  const payload = await getPayload({ config: configPromise });

  const { isEnabled: isDraftModeEnabled } = await draftMode();

  return await payload.find({
    ...options,
    // Toggle draft mode.
    draft: isDraftModeEnabled,
    // Enable access control.
    overrideAccess: false,
    // User to run the query as.
    user: isDraftModeEnabled
      ? await getPayloadUser(payload) // dynamic rendering
      : undefined, // static rendering
  });
};
