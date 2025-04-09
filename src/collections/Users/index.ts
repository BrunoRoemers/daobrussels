import type { CollectionConfig } from 'payload';

import { anyone } from '@/access/anyone';
import { role } from '@/access/role';
import { selfOrRole } from '@/collections/Users/access/self-or-role';
import { authenticated } from '../../access/authenticated';
import { defaultFieldOverrides } from './default-field-overrides';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: role('admin'),
    read: anyone, // E.g. the name of a pod host needs to be shown on the events page.
    update: selfOrRole('admin'),
    delete: role('admin'),
    unlock: role('admin'),
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
    // Show the list of users only to admins.
    hidden: ({ user }) => !user?.roles?.includes('admin'),
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      access: {
        create: selfOrRole('admin'),
        read: anyone,
        update: selfOrRole('admin'),
      },
    },
    {
      name: 'roles',
      interfaceName: 'UserRoles',
      type: 'select',
      saveToJWT: true,
      required: true,
      defaultValue: ['user'],
      hasMany: true,
      access: {
        create: role('admin'),
        read: authenticated,
        update: role('admin'),
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    },
    ...defaultFieldOverrides,
  ],
  timestamps: true,
};
