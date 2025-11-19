import type { AuthStrategy, AuthStrategyResult, CollectionAfterLogoutHook } from 'payload';
import { auth } from './better-auth-config';

export const betterAuthStrategy: AuthStrategy = {
  name: 'better-auth',
  authenticate: async ({ payload, headers }): Promise<AuthStrategyResult> => {
    const session = await auth.api.getSession({ headers });

    // TODO remove
    console.log('session', session);

    if (!session) {
      return { user: null };
    }

    // TODO via id
    const user = await payload.find({
      collection: 'users',
      where: {
        email: {
          equals: session.user.email,
        },
      },
    });

    // TODO remove
    console.log('user', user);

    if (user.totalDocs !== 1) {
      return { user: null };
    }

    return {
      user: {
        ...user.docs[0],
        collection: 'users',
        _strategy: 'better-auth',
      },
    };
  },
};

export const betterAuthLogoutHook: CollectionAfterLogoutHook = async ({ req }) => {
  auth.api.signOut({ headers: req.headers });
};
