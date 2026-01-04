import type { PostgresSchemaHook } from '@payloadcms/drizzle/postgres';
import {
  account,
  accountRelations,
  session,
  sessionRelations,
  user,
  userRelations,
  verification,
} from './better-auth-drizzle-schema';

// TODO rename file?
// TODO auto-merge?

export const beforeSchemaInit: PostgresSchemaHook = ({ schema }) => {
  return {
    ...schema,
    tables: {
      ...schema.tables,
      user,
      session,
      account,
      verification,
    },
    relations: {
      ...schema.relations,
      userRelations,
      sessionRelations,
      accountRelations,
    },
  };
};
