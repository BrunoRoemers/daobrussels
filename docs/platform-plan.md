# DAO Brussels Platform — Implementation Plan

## Context

DAO Brussels holds monthly meetings (first Wednesday of each month) focused on hacking the commons. The community needs a simple, content-first website that surfaces information about past and upcoming meetings, the pods (activities/projects) that happen during them, and allows members to comment on events using their Nostr identity — no sign-up, no passwords.

The repo is currently blank (`/Users/bruno/repos/nostr-daobxl`), just a README. This plan bootstraps the full platform from scratch.

---

## Tech Stack

- **Astro 4.x** — markdown-first framework, islands architecture, static output
- **Svelte 5.x** — Nostr interactive islands (login, comments) — smaller bundle than React, reactive stores match Nostr event streams
- **Tailwind CSS 4.x** — styling
- **nostr-tools 2.x** — NIP-07 login, relay queries, event signing (tree-shakeable, no overhead)
- **Deployment:** Vercel (static Astro output, `vercel.json` with zero config needed)

---

## Directory Structure

```
/
├── content/
│   ├── config.ts               # Zod schemas for both collections
│   ├── events/                 # One .md per monthly meeting
│   │   └── 2025-01-08.md
│   └── pods/                   # One .md per pod/project
│       └── commons-library.md
├── src/
│   ├── pages/
│   │   ├── index.astro         # Home: next event, recent pods
│   │   ├── events/
│   │   │   ├── index.astro     # All events list
│   │   │   └── [slug].astro    # Event detail + Nostr comments
│   │   ├── pods/
│   │   │   ├── index.astro     # All pods grid
│   │   │   └── [slug].astro    # Pod detail + event timeline
│   │   └── 404.astro
│   ├── components/
│   │   ├── layout/
│   │   │   ├── BaseLayout.astro
│   │   │   ├── Nav.astro       # includes <NostrLogin client:load />
│   │   │   └── Footer.astro
│   │   ├── events/
│   │   │   ├── EventCard.astro
│   │   │   └── EventHeader.astro
│   │   ├── pods/
│   │   │   ├── PodCard.astro
│   │   │   ├── PodHeader.astro
│   │   │   └── PodTimeline.astro
│   │   └── nostr/
│   │       ├── NostrLogin.svelte    # NIP-07 connect/disconnect
│   │       ├── CommentFeed.svelte   # Reads kind:1 from relay
│   │       ├── CommentForm.svelte   # Signs + publishes kind:1
│   │       └── nostrStore.ts       # Svelte store: pubkey, profile
│   └── lib/
│       ├── content.ts          # nextEvent(), recentPods() helpers
│       └── nostr.ts            # RELAYS constant, buildEventTag()
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

---

## Content Schema

### `content/config.ts`

```ts
const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    locationUrl: z.string().url().optional(),
    summary: z.string().optional(),
    pods: z.array(reference('pods')).default([]),
    nostrEventTag: z.string(),   // e.g. "daobxl-event-2025-01-08"
    draft: z.boolean().default(false),
  }),
});

const pods = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(['active', 'paused', 'completed', 'proposed']).default('active'),
    startDate: z.coerce.date().optional(),
    events: z.array(reference('events')).default([]),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
    draft: z.boolean().default(false),
  }),
});
```

Cross-references use Astro's `reference()` — broken slugs cause a **build error**, not a 404.

---

## Nostr Integration

### Login (NIP-07)
- Detect `window.nostr` (Alby, nos2x, Amber)
- `getPublicKey()` → store hex pubkey in Svelte store
- Fetch user's kind:0 metadata for display name + avatar
- No server session — identity is ephemeral per browser tab

### Comments
- Kind: **1** (standard text note)
- Association: `["t", "daobxl-event-2025-01-08"]` hashtag tag (deterministic from slug)
- Relay filter: `{ kinds: [1], "#t": ["daobxl-event-SLUG"], limit: 100 }`
- Relays: `wss://relay.damus.io` + `wss://nos.lol` (read from both, write to both)

`t`-tag threading avoids needing a pre-published root Nostr event per meeting. Works on any NIP-12 relay.

### `src/lib/nostr.ts`
```ts
export const RELAYS = ['wss://relay.damus.io', 'wss://nos.lol'];
export const buildEventTag = (slug: string) => `daobxl-event-${slug}`;
```

### `CommentFeed.svelte` (`client:visible` — defers WebSocket until scrolled into view)
1. `SimplePool` from nostr-tools
2. Subscribe with `#t` filter
3. Sort events by `created_at`, render with author kind:0 profile fetch

### `CommentForm.svelte` (visible only when logged in)
1. Build unsigned kind:1 with `t` tags
2. `window.nostr.signEvent(event)`
3. `pool.publish(RELAYS, signedEvent)`
4. Optimistically prepend to feed

---

## Key Pages

| Route | What it does |
|---|---|
| `/` | Next event countdown, 3 most recent pods |
| `/events` | Chronological list, newest first |
| `/events/[slug]` | Markdown body + pod chips + Nostr comments |
| `/pods` | Grid filtered by status |
| `/pods/[slug]` | Markdown body + event timeline (PodTimeline) |

---

## Implementation Order

### Phase 1 — Scaffold
1. `npm create astro@latest` (empty, TypeScript strict)
2. `npx astro add svelte mdx sitemap tailwind`
3. `astro.config.mjs`, `tsconfig.json`, `tailwind.config.mjs`
4. `BaseLayout.astro`, `Nav.astro`, `Footer.astro` (static, no Nostr yet)

### Phase 2 — Content model + static pages
1. `content/config.ts` with both schemas
2. Seed: 2–3 event files + 2–3 pod files
3. `events/index.astro` + `events/[slug].astro`
4. `pods/index.astro` + `pods/[slug].astro`
5. `index.astro` home page
6. `src/lib/content.ts` helpers
7. `astro build` — verify

### Phase 3 — Nostr login
1. `npm install nostr-tools`
2. `src/lib/nostr.ts`
3. `nostrStore.ts` (pubkey, profile, connected)
4. `NostrLogin.svelte` — NIP-07 flow
5. Wire into `Nav.astro` with `client:load`

### Phase 4 — Comments
1. `CommentFeed.svelte` — relay subscription, render
2. `CommentForm.svelte` — sign + publish
3. Add comments section to `events/[slug].astro`
4. Test end-to-end with Alby extension

### Phase 5 — Polish + deploy
1. `404.astro`
2. OG meta tags per event/pod
3. `public/favicon.svg`
4. `vercel.json` (likely zero config for static Astro)
5. Seed content: all 2025 meeting dates + any known pods

---

## Verification

- `astro build` passes with no type errors
- All event ↔ pod cross-references resolve (Astro `reference()` validates at build)
- Open an event page in browser → comment feed loads from relay
- Connect with Alby → post a comment → appears in feed without page reload
- Mobile nav renders correctly
- `astro preview` serves the static output locally before pushing to Vercel
