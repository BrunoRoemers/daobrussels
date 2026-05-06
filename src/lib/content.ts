import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

// ---------- Collections ------------------------------------------------------

export async function getSortedEvents() {
  const events = await getCollection('events', ({ data }) => !data.draft);
  return events.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export async function getSortedPods() {
  const pods = await getCollection('pods', ({ data }) => !data.draft);
  return pods.sort((a, b) => a.data.title.localeCompare(b.data.title));
}

export async function getNextEvent() {
  const now = new Date();
  const events = await getCollection('events', ({ data }) => !data.draft);
  const upcoming = events
    .filter((e) => e.data.date >= now)
    .sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  return upcoming[0] ?? null;
}

export async function getRecentPods(limit = 3) {
  const pods = await getCollection('pods', ({ data }) => !data.draft && data.status === 'active');
  return pods.slice(0, limit);
}

// ---------- Assembly numbering ----------------------------------------------
//
// Every event has a stable chronological "№" — its 1-based index when all
// non-draft events are sorted oldest-first. The very first DAO Brussels
// gathering is №1, the next assembly is № (count + 1).
//
// Computed once per build and cached so [slug] pages don't re-walk the
// collection for every render.

let _numberCache: Map<string, number> | null = null;

export async function getAssemblyNumbers(): Promise<Map<string, number>> {
  if (_numberCache) return _numberCache;
  const events = await getCollection('events', ({ data }) => !data.draft);
  const sorted = [...events].sort((a, b) => a.data.date.getTime() - b.data.date.getTime());
  const map = new Map<string, number>();
  sorted.forEach((e, i) => map.set(e.slug, i + 1));
  _numberCache = map;
  return map;
}

export async function assemblyNumberFor(event: CollectionEntry<'events'>): Promise<number> {
  const map = await getAssemblyNumbers();
  return map.get(event.slug) ?? 0;
}

// ---------- Counts shown across the site -----------------------------------

export interface CommunityCounts {
  /** Every non-draft event ever scheduled. */
  totalEvents: number;
  /** Events whose date is in the past (already happened). */
  heldEvents: number;
  /** All non-draft pods. */
  totalPods: number;
  /** Pods with status === 'active'. */
  activePods: number;
  /** Pods that are not active (paused / completed / proposed). */
  dormantPods: number;
  /**
   * The "current" assembly number — the № of the most recent past event.
   * Use this for the hero eyebrow ("ASSEMBLY №47") on the home page.
   */
  currentAssemblyNo: number;
}

export async function getCommunityCounts(): Promise<CommunityCounts> {
  const now = new Date();
  const events = await getCollection('events', ({ data }) => !data.draft);
  const pods = await getCollection('pods', ({ data }) => !data.draft);
  const past = events.filter((e) => e.data.date <= now);

  return {
    totalEvents: events.length,
    heldEvents: past.length,
    totalPods: pods.length,
    activePods: pods.filter((p) => p.data.status === 'active').length,
    dormantPods: pods.filter((p) => p.data.status !== 'active').length,
    currentAssemblyNo: past.length, // = № of the latest past assembly when sorted ascending
  };
}

// ---------- Date formatters -------------------------------------------------
// Pinned to UTC so frontmatter dates ("2026-06-03") format the same regardless
// of the build agent's local timezone.

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
