import type { CollectionConfig } from 'payload';

import { role } from '@/access/role';
import { authenticated } from '../../access/authenticated';

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    // FIXME: the name of the host of a pod can currently not be shown on the events page
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email', 'roles'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
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
        read: authenticated,
        update: role('admin'),
        create: role('admin'),
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
  ],
  timestamps: true,
};
