<!--
  CommentFeed — Geometric Commons discussion thread.
  Each comment is a row separated by a 1px black rule, with the author's
  Glyph (deterministic from their pubkey) as the avatar — same shape language
  as the rest of the site.
-->
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

  // ---------- glyph picker (mirror of src/lib/glyphs.ts) ----------
  // Inlined here so the Svelte island doesn't pull an Astro-only file.
  type GlyphKind =
    | 'circle' | 'ring' | 'dot-grid' | 'square' | 'diamond'
    | 'triangle' | 'half' | 'quad' | 'plus' | 'hatch';
  const KINDS: GlyphKind[] = ['circle', 'diamond', 'triangle', 'square', 'half', 'plus', 'quad', 'ring', 'hatch', 'dot-grid'];
  function glyphFor(seed: string): GlyphKind {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
    return KINDS[Math.abs(h) % KINDS.length];
  }

  function formatTime(ts: number): string {
    const diff = Date.now() / 1000 - ts;
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(ts * 1000).toLocaleDateString('en-GB', {
      year: 'numeric', month: 'short', day: 'numeric',
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

  // ---------- inline glyph rendering ----------
  // Avoids importing the Astro Glyph; SVG paths are kept identical.
  function svgFor(kind: GlyphKind, color = '#0a0a0a'): string {
    switch (kind) {
      case 'circle':
        return `<circle cx="50" cy="50" r="48" fill="${color}" stroke="${color}" stroke-width="2" />`;
      case 'ring':
        return `<circle cx="50" cy="50" r="40" fill="none" stroke="${color}" stroke-width="6" />`;
      case 'diamond':
        return `<rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" fill="${color}" stroke="${color}" stroke-width="2" />`;
      case 'triangle':
        return `<polygon points="50,6 94,90 6,90" fill="${color}" stroke="${color}" stroke-width="2" />`;
      case 'square':
        return `<rect x="2" y="2" width="96" height="96" fill="${color}" />`;
      case 'half':
        return `<path d="M 50 2 A 48 48 0 0 1 50 98 Z" fill="${color}" /><circle cx="50" cy="50" r="48" fill="none" stroke="${color}" stroke-width="2" />`;
      case 'quad':
        return `<line x1="50" y1="0" x2="50" y2="100" stroke="${color}" stroke-width="2" /><line x1="0" y1="50" x2="100" y2="50" stroke="${color}" stroke-width="2" /><circle cx="50" cy="50" r="48" fill="none" stroke="${color}" stroke-width="2" />`;
      case 'plus':
        return `<line x1="50" y1="10" x2="50" y2="90" stroke="${color}" stroke-width="8" /><line x1="10" y1="50" x2="90" y2="50" stroke="${color}" stroke-width="8" />`;
      case 'hatch':
        return `<defs><pattern id="h-${Math.random().toString(36).slice(2,8)}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="${color}" stroke-width="2" /></pattern></defs><circle cx="50" cy="50" r="48" fill="${color}" stroke="${color}" stroke-width="2" />`;
      case 'dot-grid':
        let dots = '';
        for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
          dots += `<circle cx="${10 + c * 20}" cy="${10 + r * 20}" r="3" fill="${color}" />`;
        }
        return dots;
    }
  }
</script>

<section>
  <div class="font-mono text-xs tracking-widestcaps font-bold mb-6">
    ◇ DISCUSSION · {comments.length}
  </div>

  <CommentForm {eventTag} on:comment={handleNewComment} />

  {#if loading}
    <p class="font-mono text-xs tracking-widercaps opacity-50 mt-6">LOADING COMMENTS…</p>
  {:else if comments.length === 0}
    <div class="border-t border-ink pt-6">
      <p class="font-mono text-xs tracking-widercaps opacity-60">NO COMMENTS YET — BE THE FIRST.</p>
    </div>
  {:else}
    <ol class="border-t border-ink">
      {#each comments as comment (comment.id)}
        <li class="grid grid-cols-[44px_1fr] sm:grid-cols-[56px_1fr] gap-4 py-5 border-b border-ink">
          {#if comment.authorPicture}
            <img
              src={comment.authorPicture}
              alt=""
              class="w-11 h-11 rounded-full object-cover border-2 border-ink shrink-0"
            />
          {:else}
            <svg viewBox="0 0 100 100" class="w-11 h-11 block shrink-0" aria-hidden="true">
              {@html svgFor(glyphFor(comment.pubkey))}
            </svg>
          {/if}
          <div class="min-w-0">
            <div class="flex items-baseline gap-3 flex-wrap mb-1.5">
              <span class="font-semibold text-[15px]">
                {comment.authorName ?? shortNpub(comment.pubkey)}
              </span>
              <time class="font-mono text-[11px] tracking-widercaps opacity-50">
                {formatTime(comment.created_at)}
              </time>
            </div>
            <p class="text-[15px] leading-relaxed whitespace-pre-wrap break-words m-0">
              {comment.content}
            </p>
            <div class="flex gap-4 mt-3 font-mono text-[11px] tracking-widercaps opacity-70">
              <button class="hover:opacity-100 cursor-pointer">↑ UPVOTE</button>
              <button class="hover:opacity-100 cursor-pointer">REPLY</button>
              <button class="hover:opacity-100 cursor-pointer">QUOTE</button>
            </div>
          </div>
        </li>
      {/each}
    </ol>
  {/if}
</section>
