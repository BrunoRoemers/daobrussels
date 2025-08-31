import { draftMode } from 'next/headers';
import type { Where } from 'payload';

/**
 * Construct a query that matches the slug.
 *
 * If draft mode is enabled and the slug takes the form of "preview-<id>",
 * construct a query that matches the id instead.
 */
export const slugOrPreviewIdEquals = async (slugOrId: string): Promise<Where> => {
  const { isEnabled: isDraftModeEnabled } = await draftMode();
  const id = maybeExtractIdFromSlug(slugOrId);

  if (isDraftModeEnabled && id) {
    return {
      id: {
        equals: id,
      },
    };
  }

  return {
    slug: {
      equals: slugOrId,
    },
  };
};

export const maybeExtractIdFromSlug = (slug: string): number | undefined => {
  const [_, id] = /^preview-(\d+)$/.exec(slug) ?? [];
  return id ? Number(id) : undefined;
};

export const idToPreviewSlug = (id: number): string => `preview-${id}`;
