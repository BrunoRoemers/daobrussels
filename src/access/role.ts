import type { UserRoles } from '@/payload-types';
import type { FieldAccess } from 'payload';

export const role =
  (...roles: UserRoles): FieldAccess =>
  ({ req: { user } }) => {
    // Always deny anonymous users.
    if (!user) {
      return false;
    }

    // Allow user if they have at least one of the required roles.
    return user.roles.some((r) => roles.includes(r));
  };
