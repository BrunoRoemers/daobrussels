import type { FieldAccess, TypeWithID } from 'payload';

export const self: FieldAccess<TypeWithID> = ({ id, req: { user } }) => {
  // Always deny anonymous users.
  if (!user) {
    return false;
  }

  // Deny "the access operation";
  // see: https://payloadcms.com/docs/access-control/overview#the-access-operation.
  if (!id) {
    return false;
  }

  // Check if the document represents the current user.
  return id === user.id;
};
