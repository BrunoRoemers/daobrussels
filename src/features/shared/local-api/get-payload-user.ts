import { headers as nextHeaders } from 'next/headers';
import type { Payload } from 'payload';

// NOTE: Reading the current user implies that the whole route is opted into dynamic rendering at request time.
//       Run `npm run build` to see whether a route is rendered at build time or on demand.
//       See: https://nextjs.org/docs/app/building-your-application/rendering/server-components#dynamic-apis
export const getPayloadUser = async (payload: Payload) => {
  const headers = await nextHeaders();
  const auth = await payload.auth({ headers });
  return auth.user;
};
