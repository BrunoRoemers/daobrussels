export const RELAYS = ['wss://relay.damus.io', 'wss://nos.lol'];

export function buildEventTag(slug: string): string {
  return `daobxl-event-${slug}`;
}

export function truncatePubkey(pubkey: string): string {
  return `${pubkey.slice(0, 8)}…${pubkey.slice(-8)}`;
}
