import { getCollection } from 'astro:content';

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

// Date formatters — pinned to UTC so frontmatter dates ("2026-06-03") format
// the same regardless of the build agent's local timezone.

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
