import type {
  CollectionAdminOptions,
  CollectionSlug,
  LivePreviewConfig,
  PayloadRequest,
} from 'payload';
import { z } from 'zod';
import { formatUrl } from '../../utilities/url/format-url';
import { idToPreviewSlug } from './slug-or-preview-id-equals';

/**
 * Configure collections that support preview.
 */
const collectionNameToRoute: Partial<Record<CollectionSlug, string>> = {
  events: '/events',
};

/**
 * Generate the URL for the (draft) preview of a document.
 */
export const generatePreviewUrl =
  (collection: CollectionSlug): CollectionAdminOptions['preview'] =>
  (data, { req }) =>
    _generatePreviewUrl(collection, data, req, false);

/**
 * Generate the URL for the live preview of a document.
 */
export const generateLivePreviewUrl =
  (collection: CollectionSlug): LivePreviewConfig['url'] =>
  ({ data, req }) =>
    _generatePreviewUrl(collection, data, req, true);

const _generatePreviewUrl = (
  collection: CollectionSlug,
  data: Record<string, unknown>,
  req: PayloadRequest,
  useId: boolean,
): string => {
  const route = collectionNameToRoute[collection];
  if (!route) {
    throw new Error(`Collection "${collection}" does not support preview.`);
  }

  // NOTE: The slug may be null or change during editing, which breaks the live preview,
  //       so we can choose to use the id instead.
  const id = z.number().parse(data.id);
  const slug = z.string().nullable().parse(data.slug);
  const fragment: string = useId ? idToPreviewSlug(id) : (slug ?? idToPreviewSlug(id));
  const path = `${route}/${fragment}`;

  return formatUrl(`${req.protocol}//${req.host}/next/preview`, { path });
};
