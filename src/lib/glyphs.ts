import type { GlyphKind } from '../components/marks/types';

/**
 * Deterministically pick a glyph kind from a string seed (slug, pubkey, name).
 * The shape language is the visual identity of every entity in the platform —
 * stable per-seed selection means the same pod / author always shows up with
 * the same shape, without requiring authors to assign one manually.
 */
const KINDS: GlyphKind[] = [
  'circle',
  'diamond',
  'triangle',
  'square',
  'half',
  'plus',
  'quad',
  'ring',
  'hatch',
  'dot-grid',
];

export function glyphForSeed(seed: string): GlyphKind {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return KINDS[Math.abs(h) % KINDS.length];
}
