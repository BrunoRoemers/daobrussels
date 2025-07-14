import type { PayloadRequest, RunJobAccess } from 'payload';
import { role } from './role';

export const adminOrCron: RunJobAccess = ({ req }) => {
  return role('admin')({ req }) || hasCronSecret(req);
};

const hasCronSecret = (req: PayloadRequest) => {
  const authHeader = req.headers.get('authorization');
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
};
