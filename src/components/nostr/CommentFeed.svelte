<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { SimplePool } from 'nostr-tools/pool';
  import type { Event } from 'nostr-tools';
  import { npubEncode } from 'nostr-tools/nip19';
  import { nostrStore } from './nostrStore';
  import CommentForm from './CommentForm.svelte';
  import { RELAYS } from '../../lib/nostr';

  export let eventTag: string;

  interface Comment {
    id: string;
    pubkey: string;
    content: string;
    created_at: number;
    authorName?: string;
    authorPicture?: string;
  }

  let comments: Comment[] = [];
  let loading = true;
  let pool: SimplePool;
  let sub: { close: () => void } | null = null;

  function formatTime(ts: number): string {
    return new Date(ts * 1000).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function shortNpub(pubkey: string): string {
    try {
      const npub = npubEncode(pubkey);
      return `${npub.slice(0, 12)}…`;
    } catch {
      return `${pubkey.slice(0, 8)}…`;
    }
  }

  async function fetchProfile(pubkey: string): Promise<{ name?: string; picture?: string }> {
    try {
      const events = await pool.querySync(RELAYS, { kinds: [0], authors: [pubkey], limit: 1 });
      if (events.length > 0) {
        const meta = JSON.parse(events[0].content);
        return { name: meta.display_name ?? meta.name, picture: meta.picture };
      }
    } catch {
      // best-effort
    }
    return {};
  }

  onMount(async () => {
    pool = new SimplePool();
    const seen = new Set<string>();

    sub = pool.subscribeMany(
      RELAYS,
      [{ kinds: [1], '#t': [eventTag], limit: 100 }],
      {
        onevent(event: Event) {
          if (seen.has(event.id)) return;
          seen.add(event.id);
          const comment: Comment = {
            id: event.id,
            pubkey: event.pubkey,
            content: event.content,
            created_at: event.created_at,
          };
          comments = [comment, ...comments].sort((a, b) => b.created_at - a.created_at);
          // fetch profile async
          fetchProfile(event.pubkey).then(({ name, picture }) => {
            comments = comments.map((c) =>
              c.id === event.id ? { ...c, authorName: name, authorPicture: picture } : c
            );
          });
        },
        oneose() {
          loading = false;
        },
      }
    );
  });

  onDestroy(() => {
    sub?.close();
    pool?.close(RELAYS);
  });

  function handleNewComment(event: CustomEvent<Comment>) {
    const c = event.detail;
    if (!comments.find((x) => x.id === c.id)) {
      comments = [c, ...comments];
    }
  }
</script>

<section class="mt-12 border-t border-gray-200 pt-10">
  <h2 class="text-xl font-semibold text-gray-900 mb-6">Comments</h2>

  <CommentForm {eventTag} on:comment={handleNewComment} />

  {#if loading}
    <p class="text-sm text-gray-400 mt-6">Loading comments…</p>
  {:else if comments.length === 0}
    <p class="text-sm text-gray-400 mt-6">No comments yet. Be the first!</p>
  {:else}
    <ol class="mt-6 space-y-5">
      {#each comments as comment (comment.id)}
        <li class="flex gap-3">
          {#if comment.authorPicture}
            <img
              src={comment.authorPicture}
              alt="avatar"
              class="w-8 h-8 rounded-full object-cover border border-gray-200 shrink-0 mt-0.5"
            />
          {:else}
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-500 shrink-0 mt-0.5">
              {shortNpub(comment.pubkey).slice(0, 1).toUpperCase()}
            </div>
          {/if}
          <div class="flex-1 min-w-0">
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-sm font-medium text-gray-900">
                {comment.authorName ?? shortNpub(comment.pubkey)}
              </span>
              <time class="text-xs text-gray-400">{formatTime(comment.created_at)}</time>
            </div>
            <p class="text-sm text-gray-700 whitespace-pre-wrap break-words">{comment.content}</p>
          </div>
        </li>
      {/each}
    </ol>
  {/if}
</section>
