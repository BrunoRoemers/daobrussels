import { Pool as NeonPool } from '@neondatabase/serverless';
import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import { Pool, type PoolConfig } from 'pg';

const getDatabase = (): Pool => {
  const dbUrl = new URL(process.env.POSTGRES_URL ?? '');

  // Use the `auth` schema instead of the default `public` schema to avoid conflicts with Payload CMS.
  dbUrl.searchParams.set('options', '-c search_path=auth');

  const poolConfig: PoolConfig = {
    connectionString: dbUrl.toString(),
  };

  // Switch the database adapter based on the connection string,
  // like Payload's `vercelPostgresAdapter` does internally.
  return ['127.0.0.1', 'localhost'].includes(dbUrl.hostname)
    ? new Pool(poolConfig)
    : new NeonPool(poolConfig);
};

export const auth = betterAuth({
  // TODO baseURL from Payload

  database: getDatabase(),

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
