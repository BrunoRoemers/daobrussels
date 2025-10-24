import type { FieldAccess } from 'payload';

/**
 * No users have access. This field can only be accessed via code.
 */
export const system: FieldAccess = () => {
  return false;
};
