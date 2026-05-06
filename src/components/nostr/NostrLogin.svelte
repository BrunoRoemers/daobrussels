<script lang="ts">
  import { onMount } from 'svelte';
  import { SimplePool } from 'nostr-tools/pool';
  import { npubEncode } from 'nostr-tools/nip19';
  import { nostrStore, disconnect, type NostrProfile } from './nostrStore';
  import { RELAYS } from '../../lib/nostr';

  let hasExtension = false;
  let loading = false;
  let error = '';

  onMount(() => {
    hasExtension = typeof window !== 'undefined' && 'nostr' in window;
  });

  async function connect() {
    if (!window.nostr) return;
    loading = true;
    error = '';
    try {
      const pubkey = await window.nostr.getPublicKey();
      const pool = new SimplePool();
      let profile: NostrProfile | null = null;
      try {
        const events = await pool.querySync(RELAYS, { kinds: [0], authors: [pubkey], limit: 1 });
        if (events.length > 0) {
          profile = JSON.parse(events[0].content) as NostrProfile;
        }
      } catch {
        // profile fetch is best-effort
      } finally {
        pool.close(RELAYS);
      }
      nostrStore.set({ connected: true, pubkey, profile });
    } catch (e) {
      error = 'Connection cancelled.';
    } finally {
      loading = false;
    }
  }

  function getDisplayName(pubkey: string, profile: NostrProfile | null): string {
    if (profile?.display_name) return profile.display_name;
    if (profile?.name) return profile.name;
    try {
      const npub = npubEncode(pubkey);
      return `${npub.slice(0, 12)}…`;
    } catch {
      return `${pubkey.slice(0, 8)}…`;
    }
  }
</script>

{#if $nostrStore.connected}
  <div class="flex items-center gap-2">
    {#if $nostrStore.profile?.picture}
      <img
        src={$nostrStore.profile.picture}
        alt="avatar"
        class="w-7 h-7 rounded-full object-cover border border-gray-200"
      />
    {:else}
      <div class="w-7 h-7 rounded-full bg-dao-green/20 flex items-center justify-center text-xs font-medium text-dao-dark">
        {getDisplayName($nostrStore.pubkey!, $nostrStore.profile).slice(0, 1).toUpperCase()}
      </div>
    {/if}
    <span class="text-sm text-gray-700 hidden sm:block">
      {getDisplayName($nostrStore.pubkey!, $nostrStore.profile)}
    </span>
    <button
      on:click={disconnect}
      class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
      title="Disconnect"
    >
      ✕
    </button>
  </div>
{:else}
  <div class="flex items-center gap-2">
    {#if hasExtension}
      <button
        on:click={connect}
        disabled={loading}
        class="text-sm font-medium text-dao-green border border-dao-light/60 px-3 py-1 rounded-full hover:bg-dao-light/20 transition-colors disabled:opacity-50"
      >
        {loading ? 'Connecting…' : 'Connect Nostr'}
      </button>
    {:else}
      <a
        href="https://getalby.com"
        target="_blank"
        rel="noopener noreferrer"
        class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        title="Install a Nostr extension like Alby to log in"
      >
        Get Alby ↗
      </a>
    {/if}
    {#if error}
      <span class="text-xs text-red-500">{error}</span>
    {/if}
  </div>
{/if}
