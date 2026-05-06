<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { SimplePool } from 'nostr-tools/pool';
  import { nostrStore } from './nostrStore';
  import { RELAYS } from '../../lib/nostr';

  export let eventTag: string;

  const dispatch = createEventDispatcher();

  let text = '';
  let submitting = false;
  let error = '';

  async function submit() {
    if (!text.trim() || !$nostrStore.pubkey || submitting) return;
    submitting = true;
    error = '';
    try {
      const unsigned = {
        kind: 1,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ['t', eventTag],
          ['t', 'daobxl'],
        ],
        content: text.trim(),
        pubkey: $nostrStore.pubkey,
      };
      // @ts-ignore — window.nostr is injected by the extension
      const signed = await window.nostr.signEvent(unsigned);
      const pool = new SimplePool();
      await Promise.any(pool.publish(RELAYS, signed));
      pool.close(RELAYS);
      dispatch('comment', {
        id: signed.id,
        pubkey: signed.pubkey,
        content: signed.content,
        created_at: signed.created_at,
        authorName: $nostrStore.profile?.display_name ?? $nostrStore.profile?.name,
        authorPicture: $nostrStore.profile?.picture,
      });
      text = '';
    } catch (e) {
      error = 'Failed to publish. Please try again.';
    } finally {
      submitting = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      submit();
    }
  }
</script>

{#if $nostrStore.connected}
  <form on:submit|preventDefault={submit} class="mb-6">
    <textarea
      bind:value={text}
      on:keydown={handleKeydown}
      placeholder="Leave a comment… (Cmd+Enter to submit)"
      rows="3"
      class="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-dao-green resize-none"
      disabled={submitting}
    ></textarea>
    <div class="flex items-center justify-between mt-2">
      {#if error}
        <p class="text-xs text-red-500">{error}</p>
      {:else}
        <span class="text-xs text-gray-400">Published to Nostr</span>
      {/if}
      <button
        type="submit"
        disabled={!text.trim() || submitting}
        class="text-sm font-medium bg-dao-green text-white px-4 py-1.5 rounded-full hover:bg-dao-dark transition-colors disabled:opacity-40"
      >
        {submitting ? 'Publishing…' : 'Publish'}
      </button>
    </div>
  </form>
{:else}
  <p class="text-sm text-gray-500 mb-6">
    <span class="font-medium">Connect your Nostr account</span> (top right) to leave a comment.
  </p>
{/if}
