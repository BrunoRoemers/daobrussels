<!--
  NostrLogin — Geometric Commons sign-in pill in the nav.
  Shows ink-on-paper "SIGN IN ↗" button when disconnected; once connected,
  shows a small avatar (or deterministic glyph fallback) + display name.
-->
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
      return `${npub.slice(0, 10)}…`;
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
        alt=""
        class="w-7 h-7 rounded-full object-cover border-2 border-ink"
      />
    {:else}
      <div class="w-7 h-7 rounded-full bg-ink text-paper border-2 border-ink flex items-center justify-center font-mono text-[11px] font-bold">
        {getDisplayName($nostrStore.pubkey ?? '', $nostrStore.profile).slice(0, 1).toUpperCase()}
      </div>
    {/if}
    <span class="text-sm hidden sm:block max-w-[140px] truncate">
      {getDisplayName($nostrStore.pubkey ?? '', $nostrStore.profile)}
    </span>
    <button
      on:click={disconnect}
      class="font-mono text-[11px] tracking-widercaps opacity-50 hover:opacity-100 cursor-pointer"
      title="Disconnect"
      aria-label="Disconnect"
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
        class="bg-ink text-paper px-4 py-2.5 font-semibold text-xs tracking-wide
               cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity"
      >
        {loading ? 'CONNECTING…' : 'SIGN IN ↗'}
      </button>
    {:else}
      <a
        href="https://getalby.com"
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-[11px] tracking-widercaps opacity-60 hover:opacity-100 transition-opacity"
        title="Install a Nostr extension like Alby to log in"
      >
        GET ALBY ↗
      </a>
    {/if}
    {#if error}
      <span class="font-mono text-[11px] tracking-widercaps text-ink">⚠ {error.toUpperCase()}</span>
    {/if}
  </div>
{/if}
