import type { User, UserRoles } from '@/payload-types';
import type { FieldAccess } from 'payload';
import { role } from '../../../access/role';
import { self } from './self';

export const selfOrRole =
  (...roles: UserRoles): FieldAccess<User> =>
  (args) => {
    return self(args) || role(...roles)(args);
  };
