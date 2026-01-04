// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';

import path from 'path';
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';

import { Media } from '@/features/media/media-collection';
import { Pods } from '@/features/pods/pod-collection';
import { resendAdapter } from '@payloadcms/email-resend';
import { beforeSchemaInit } from './features/auth/before-schema-init';
import { bootstrapRevalidateEveryMorning } from './features/cron/config/revalidate-every-morning-cron';
import { jobsConfig } from './features/cron/jobs-config';
import { Events } from './features/events/event-collection';
import { GoogleCloudStorage } from './features/media/google-cloud-storage-plugin';
import { PodsAtEvents } from './features/pods-at-events/pod-at-event-collection';
import { Search } from './features/search/search-plugin';
import { deploymentUrls } from './features/shared/deployment-urls';
import { Users } from './features/users/user-collection';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '- DAO Brussels',
    },
    components: {
      graphics: {
        Logo: '/components/admin/login-logo.tsx#LoginLogo',
      },
      actions: ['/components/admin/view-site-link.tsx#ViewSiteLink'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.POSTGRES_URL || '',
    },
    beforeSchemaInit: [beforeSchemaInit],
  }),
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        defaultFromAddress: 'noreply@sys.dao.brussels',
        defaultFromName: 'DAO Brussels',
        apiKey: process.env.RESEND_API_KEY,
      })
    : undefined,
  collections: [Pods, PodsAtEvents, Events, Media, Users],
  jobs: jobsConfig,
  onInit: async (payload) => {
    await bootstrapRevalidateEveryMorning(payload);
  },
  cors: deploymentUrls,
  plugins: [GoogleCloudStorage, Search],
  secret: process.env.PAYLOAD_SECRET!,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  telemetry: false,
});
