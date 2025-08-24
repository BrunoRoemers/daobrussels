import { adminOrCron } from '@/features/auth/access-filters/admin-or-cron';
import type { JobsConfig } from 'payload';
import { jobsCollectionOverrides } from './config/jobs-collection-overrides';
import { revalidateEveryMorning } from './config/revalidate-every-morning-cron';

export const jobsConfig: JobsConfig = {
  jobsCollectionOverrides: jobsCollectionOverrides,
  access: {
    run: adminOrCron,
  },
  tasks: [revalidateEveryMorning],
};
