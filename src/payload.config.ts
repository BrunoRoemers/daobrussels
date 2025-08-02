// storage-adapter-import-placeholder
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres';

import path from 'path';
import { buildConfig } from 'payload';
import sharp from 'sharp'; // sharp-import
import { fileURLToPath } from 'url';

import { adminOrCron } from './access/adminOrCron';
import { Events } from './collections/Events';
import {
  bootstrapRevalidateEveryMorning,
  revalidateEveryMorning,
} from './collections/Events/tasks/revalidate-every-morning';
import { Media } from './collections/Media';
import { jobsCollectionOverrides } from './collections/payload-jobs';
import { Pods } from './collections/Pods';
import { PodsAtEvents } from './collections/PodsAtEvents';
import { Users } from './collections/Users';
import { plugins } from './plugins';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    meta: {
      titleSuffix: '- DAO Brussels',
    },
    components: {
      graphics: {
        Logo: '/components/admin/logo.tsx#Logo',
      },
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
  }),
  collections: [Pods, PodsAtEvents, Events, Media, Users],
  jobs: {
    jobsCollectionOverrides: jobsCollectionOverrides,
    access: {
      run: adminOrCron,
    },
    tasks: [revalidateEveryMorning],
  },
  onInit: async (payload) => {
    await bootstrapRevalidateEveryMorning(payload);
  },
  cors: [process.env.NEXT_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins: [...plugins],
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  telemetry: false,
});
