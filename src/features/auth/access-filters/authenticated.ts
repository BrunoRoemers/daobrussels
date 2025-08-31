import type { FieldAccess } from 'payload';

export const authenticated: FieldAccess = ({ req: { user } }) => {
  return Boolean(user);
};
