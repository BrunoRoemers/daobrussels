<!--
  CommentForm — Geometric Commons composer.
  Hard 2px border, mono caps footer label, ink "POST →" button.
  Uses Cmd+Enter to submit, mirrors the prototype's textarea + button bar.
-->
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
  <form on:submit|preventDefault={submit} class="border-2 border-ink mb-8">
    <textarea
      bind:value={text}
      on:keydown={handleKeydown}
      placeholder="Add to the conversation. Bring a question, a seed, a link…"
      rows="3"
      disabled={submitting}
      class="w-full box-border border-0 px-4 py-4 sm:px-5 sm:py-5 text-[15px] leading-relaxed
             resize-y min-h-[100px] outline-none bg-transparent font-sans
             placeholder:opacity-40 focus:bg-ink/[0.02]"
    ></textarea>
    <div class="border-t border-ink flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
      {#if error}
        <span class="font-mono text-[11px] tracking-widercaps text-ink">⚠ {error.toUpperCase()}</span>
      {:else}
        <span class="font-mono text-[11px] tracking-widercaps opacity-50 hidden sm:inline">
          MARKDOWN · @MENTIONS · /COMMANDS
        </span>
        <span class="font-mono text-[11px] tracking-widercaps opacity-50 sm:hidden">
          ⌘+ENTER TO POST
        </span>
      {/if}
      <button
        type="submit"
        disabled={!text.trim() || submitting}
        class="bg-ink text-paper border-0 px-4 py-2 font-semibold text-xs tracking-wide
               cursor-pointer hover:opacity-90 disabled:opacity-40 transition-opacity"
      >
        {submitting ? 'PUBLISHING…' : 'POST →'}
      </button>
    </div>
  </form>
{:else}
  <div class="border-2 border-dashed border-ink mb-8 px-5 py-6 text-center">
    <p class="font-mono text-xs tracking-widercaps">
      CONNECT NOSTR TO JOIN THE DISCUSSION ↗
    </p>
    <p class="text-sm opacity-60 mt-2">
      Sign in via the menu above with any Nostr extension (Alby, nos2x).
    </p>
  </div>
{/if}
