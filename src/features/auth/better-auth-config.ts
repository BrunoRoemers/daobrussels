import { betterAuth } from 'better-auth';
import { magicLink } from 'better-auth/plugins';
import Database from 'better-sqlite3';

export const auth = betterAuth({
  // TODO baseURL from Payload

  // TODO move to Payload?
  database: new Database('better-auth.db'),

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
