import { drizzle } from '@payloadcms/db-vercel-postgres/drizzle/node-postgres';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { magicLink } from 'better-auth/plugins';
import * as authSchema from './better-auth-drizzle-schema';

const getDatabaseUrl = (): URL => {
  if (!process.env.POSTGRES_URL) {
    throw new Error('POSTGRES_URL is not set');
  }

  const dbUrl = new URL(process.env.POSTGRES_URL);

  // Use the `auth` schema instead of the default `public` schema to avoid conflicts with Payload CMS.
  dbUrl.searchParams.set('options', '-c search_path=auth');

  return dbUrl;
};

// TODO Switch the database adapter based on the connection string, like Payload's `vercelPostgresAdapter` does internally.
// ['127.0.0.1', 'localhost'].includes(dbUrl.hostname) ? <local db> : <neon db>

const getDrizzleAdapter = () => {
  const dbUrl = getDatabaseUrl();
  const db = drizzle(dbUrl.toString());
  return drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  });
};

export const auth = betterAuth({
  // TODO baseURL from Payload

  database: getDrizzleAdapter(),

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, token, url }, request) => {
      // TODO send reset password
      console.log('sendResetPassword', { user, token, url, request });
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        // TODO send magic link
        console.log('sendMagicLink', { email, token, url, request });
      },
    }),
  ],

  telemetry: {
    enabled: false,
  },
});
