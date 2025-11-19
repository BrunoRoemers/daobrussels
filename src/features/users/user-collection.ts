import type { CollectionConfig } from 'payload';

import { anyone } from '@/features/auth/access-filters/anyone';
import { role } from '@/features/auth/access-filters/role';
import { selfOrRole } from '@/features/auth/access-filters/self-or-role';
import { authenticated } from '../auth/access-filters/authenticated';
import { betterAuthLogoutHook, betterAuthStrategy } from '../auth/better-auth-strategy';
import { defaultFieldOverrides } from './config/default-field-overrides';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated, // who can access the admin UI?
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
  auth: {
    disableLocalStrategy: {
      // TODO get rid of fields once we're happy with the implementation
      enableFields: true,
    },
    strategies: [betterAuthStrategy],
  },
  hooks: {
    afterLogout: [betterAuthLogoutHook],
  },
  // TODO clean up custom fields as well as hidden fields, align with Better Auth.
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
        {
          label: 'Anon',
          value: 'anon',
        },
      ],
    },
    {
      name: 'uploads',
      type: 'join',
      collection: 'media',
      on: 'uploadedBy',
      hasMany: true,
      admin: {
        allowCreate: false,
        defaultColumns: ['filename', 'alt', 'events', 'updatedAt'],
      },
    },
    ...defaultFieldOverrides,
  ],
  timestamps: true,
};
