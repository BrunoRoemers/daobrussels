import { role } from '@/features/auth/access-filters/role';
import { searchPlugin } from '@payloadcms/plugin-search';
import { beforeSyncWithSearch } from './config/before-sync-hook';
import { searchFields } from './config/search-collection-field-overrides';

export const Search = searchPlugin({
  collections: ['events'],
  beforeSync: beforeSyncWithSearch,
  searchOverrides: {
    fields: ({ defaultFields }) => {
      return [...defaultFields, ...searchFields];
    },
    access: {
      read: role('admin'),
    },
    admin: {
      group: 'System',
    },
  },
});
