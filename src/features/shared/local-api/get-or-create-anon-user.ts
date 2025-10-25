import 'server-only';

import type { User } from '@/payload-types';
import { randomBytes } from 'node:crypto';
import type { Payload } from 'payload';
import { runTransaction } from './run-transaction';

export const getOrCreateAnonUser = async (payload: Payload): Promise<User> => {
  return runTransaction(payload, async (req) => {
    const anons = await payload.find({
      req,
      collection: 'users',
      where: {
        roles: {
          equals: 'anon',
        },
      },
      limit: 2,
    });

    if (anons.totalDocs === 1) {
      return anons.docs[0];
    }

    if (anons.totalDocs > 1) {
      throw new Error('Invalid state: found multiple users with "anon" role');
    }

    return await payload.create({
      req,
      collection: 'users',
      data: {
        name: 'Anon',
        email: 'anon@example.com',
        roles: ['anon'],
        password: randomBytes(64).toString('base64'),
      },
    });
  });
};
