import { role } from '@/features/auth/access-filters/role';
import type { JobsConfig } from 'payload';

/**
 * Allow admins to see and delete jobs from the admin panel.
 */
export const jobsCollectionOverrides: JobsConfig['jobsCollectionOverrides'] = ({
  defaultJobsCollection,
}) => {
  defaultJobsCollection.admin = defaultJobsCollection.admin ?? {};
  defaultJobsCollection.admin.hidden = false;
  defaultJobsCollection.admin.description =
    'The "nightly" queue runs at 11PM UTC, which is 12AM (winter time) or 1AM (summer time) in Brussels.';
  defaultJobsCollection.admin.defaultColumns = ['id', 'queue', 'taskSlug', 'input', 'taskStatus'];

  defaultJobsCollection.access = defaultJobsCollection.access ?? {};
  defaultJobsCollection.access.create = () => false;
  defaultJobsCollection.access.read = role('admin');
  defaultJobsCollection.access.update = () => false;
  defaultJobsCollection.access.delete = role('admin');

  return defaultJobsCollection;
};
