type Identifiable = number | { id: number } | null | undefined;

/**
 * Payload's APIs return either the id of an entity or the entity itself.
 * This helper function returns the id in either case.
 */
export const getId = (data: Identifiable): number | undefined => {
  if (data === null || data === undefined) {
    return undefined;
  }

  return typeof data === 'object' ? data.id : data;
};
