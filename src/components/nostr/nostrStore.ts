import { writable } from 'svelte/store';

export interface NostrProfile {
  name?: string;
  display_name?: string;
  picture?: string;
  about?: string;
  nip05?: string;
}

export interface NostrState {
  connected: boolean;
  pubkey: string | null;
  profile: NostrProfile | null;
}

const initial: NostrState = {
  connected: false,
  pubkey: null,
  profile: null,
};

export const nostrStore = writable<NostrState>(initial);

export function disconnect() {
  nostrStore.set(initial);
}
