/**
 * Shared types for the Mark / Glyph design language.
 * Lives in a plain TypeScript file so it can be imported from both `.astro`
 * components and `.ts` helpers without depending on Astro-specific export
 * resolution.
 */

export type GlyphKind =
  | 'circle'
  | 'ring'
  | 'dot-grid'
  | 'square'
  | 'diamond'
  | 'triangle'
  | 'half'
  | 'quad'
  | 'plus'
  | 'hatch';
