import { selfOrRole } from '@/collections/Users/access/self-or-role';
import type { Field } from 'payload';

// The following fields are automatically added to the `users` collection.
// They should not appear in unauthenticated requests.
export const defaultFieldOverrides: Field[] = [
  {
    name: 'email',
    type: 'email',
    access: {
      create: selfOrRole('admin'),
      read: selfOrRole('admin'),
      update: selfOrRole('admin'),
    },
  },
  {
    name: 'updatedAt',
    type: 'date',
    admin: {
      hidden: true,
    },
    access: {
      create: selfOrRole('admin'),
      read: selfOrRole('admin'),
      update: selfOrRole('admin'),
    },
  },
  {
    name: 'createdAt',
    type: 'date',
    admin: {
      hidden: true,
    },
    access: {
      create: selfOrRole('admin'),
      read: selfOrRole('admin'),
      update: selfOrRole('admin'),
    },
  },
  {
    name: 'loginAttempts',
    type: 'number',
    access: {
      create: selfOrRole('admin'),
      read: selfOrRole('admin'),
      update: selfOrRole('admin'),
    },
  },
];
