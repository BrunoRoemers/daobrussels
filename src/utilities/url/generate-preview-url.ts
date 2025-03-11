import type {
  CollectionAdminOptions,
  CollectionSlug,
  LivePreviewConfig,
  PayloadRequest,
} from 'payload'
import { z } from 'zod'
import { formatUrl } from './format-url'

const collectionNameToRoute: Partial<Record<CollectionSlug, string>> = {
  events: '/events',
}

/**
 * Generate the URL for the (draft) preview of a document.
 */
export const generatePreviewUrl =
  (collection: CollectionSlug): CollectionAdminOptions['preview'] =>
  (data, { req }) =>
    _generatePreviewUrl(collection, data, req)

/**
 * Generate the URL for the live preview of a document.
 */
export const generateLivePreviewUrl =
  (collection: CollectionSlug): LivePreviewConfig['url'] =>
  ({ data, req }) =>
    _generatePreviewUrl(collection, data, req)

const _generatePreviewUrl = (
  collection: CollectionSlug,
  data: Record<string, unknown>,
  req: PayloadRequest,
): string => {
  const route = z.string().parse(collectionNameToRoute[collection])
  const slug = z.string().parse(data.slug)
  const path = `${route}/${slug}`

  return formatUrl(`${req.protocol}//${req.host}/next/preview`, { path })
}
