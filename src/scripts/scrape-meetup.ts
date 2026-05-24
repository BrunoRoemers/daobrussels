// Scrape DAO Brussels events from Meetup.com and write src/content/events/*.md
// Run with: npx tsx src/scripts/scrape-meetup.ts

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PUBLIC_IMAGES = path.join(ROOT, "public", "images");
const EVENTS_DIR = path.join(ROOT, "src", "content", "events");

const GROUP = "daobrussels";
const QUERY_HASH =
  "321388b1e4a11b17a57efe3ae7a90abfecbc703a4f4e99519772294924c21351";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0";

// ── Types ─────────────────────────────────────────────────────────────────────

interface MeetupEvent {
  id: string;
  title: string;
  dateTime: string;
  endTime?: string;
  description: string;
  status: "PAST" | "ACTIVE" | "CANCELLED";
  isOnline: boolean;
  venue?: { name: string; address: string };
  coverPhotoUrl?: string;
  eventUrl: string;
  going: number;
}

// ── Meetup API ────────────────────────────────────────────────────────────────

async function fetchEventsPage(cursor?: string): Promise<{
  events: MeetupEvent[];
  endCursor: string | null;
  totalCount: number;
}> {
  const variables: Record<string, string> = {
    urlname: GROUP,
    beforeDateTime: new Date().toISOString(),
  };
  if (cursor) variables.after = cursor;

  const res = await fetch("https://www.meetup.com/gql2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apollographql-client-name": "nextjs-web",
      "User-Agent": UA,
      Origin: "https://www.meetup.com",
      Referer: `https://www.meetup.com/${GROUP}/events/?type=past`,
    },
    body: JSON.stringify({
      operationName: "getPastGroupEvents",
      variables,
      extensions: { persistedQuery: { version: 1, sha256Hash: QUERY_HASH } },
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} from /gql2`);
  const json = await res.json();
  if (json.errors?.length)
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);

  const conn = json?.data?.groupByUrlname?.events;
  if (!conn) throw new Error("Unexpected response shape from /gql2");

  const events: MeetupEvent[] = (conn.edges ?? []).map(({ node: e }: any) => ({
    id: e.id,
    title: e.title,
    dateTime: e.dateTime,
    endTime: e.endTime ?? undefined,
    description: e.description ?? "",
    status: e.status,
    isOnline: e.isOnline ?? false,
    venue:
      e.venue?.name && e.venue.name !== "Online event"
        ? {
            name: e.venue.name,
            address: [e.venue.address, e.venue.city]
              .filter(Boolean)
              .join(", "),
          }
        : undefined,
    coverPhotoUrl:
      e.displayPhoto?.highResUrl ??
      e.featuredEventPhoto?.highResUrl ??
      undefined,
    eventUrl: e.eventUrl,
    going: e.going?.totalCount ?? 0,
  }));

  return {
    events,
    endCursor: conn.pageInfo?.hasNextPage ? conn.pageInfo.endCursor : null,
    totalCount: conn.totalCount ?? 0,
  };
}

export async function fetchAllEvents(): Promise<MeetupEvent[]> {
  const all: MeetupEvent[] = [];
  let cursor: string | undefined;
  let page = 1;

  while (true) {
    const { events, endCursor, totalCount } = await fetchEventsPage(cursor);
    all.push(...events);
    process.stderr.write(
      `  page ${page}: ${events.length} events (${all.length}/${totalCount})\n`
    );
    if (!endCursor) break;
    cursor = endCursor;
    page++;
  }

  return all.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
}

// ── Local images ──────────────────────────────────────────────────────────────

const MONTH_ABBR = [
  "jan","feb","mar","apr","may","jun",
  "jul","aug","sep","oct","nov","dec",
];

function getLocalImages(year: number, month: number): string[] {
  const mon = MONTH_ABBR[month - 1]; // e.g. month=11 → "nov"
  const dir = path.join(PUBLIC_IMAGES, String(year));
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((f) => f.startsWith(`cw-${mon}-`) && /\.(jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      // filename: cw-nov-3.jpg → trailing number is the last dash-segment
      const n = (f: string) => parseInt(f.split("-").at(-1)!);
      return n(a) - n(b);
    })
    .map((f) => `/images/${year}/${f}`);
}

function isCryptoWednesday(title: string): boolean {
  return title.toLowerCase().includes("crypto wednesday");
}

// ── Image download ────────────────────────────────────────────────────────────

async function downloadImage(url: string, destPath: string): Promise<boolean> {
  if (fs.existsSync(destPath)) return true;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return false;
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, Buffer.from(await res.arrayBuffer()));
    return true;
  } catch {
    return false;
  }
}

// ── Markdown generation ───────────────────────────────────────────────────────

function localDate(dateTime: string): string {
  // The API returns strings like "2021-10-06T19:00:00+02:00" — extract date as-is.
  return dateTime.slice(0, 10);
}

function yamlStr(value: string): string {
  // Use double-quoted YAML string, escaping backslashes and double-quotes.
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function buildFrontmatter(event: MeetupEvent, images: string[]): string {
  const lines: string[] = ["---"];
  lines.push(`title: ${yamlStr(event.title)}`);
  lines.push(`date: ${localDate(event.dateTime)}`);

  if (event.venue) {
    lines.push(`location: ${yamlStr(event.venue.name)}`);
    lines.push(`address: ${yamlStr(event.venue.address)}`);
  } else if (event.isOnline) {
    lines.push(`location: "Online"`);
  }

  lines.push(`meetupUrl: ${yamlStr(event.eventUrl)}`);
  lines.push(`going: ${event.going}`);

  if (images.length > 0) {
    lines.push("images:");
    for (const img of images) {
      lines.push(`  - ${yamlStr(img)}`);
    }
  }

  lines.push("---");
  return lines.join("\n");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("Fetching all DAO Brussels events from Meetup.com...\n");

  const events = await fetchAllEvents();
  console.log(`\nFetched ${events.length} events. Generating markdown files...\n`);

  fs.mkdirSync(EVENTS_DIR, { recursive: true });

  const usedFilenames = new Set<string>();

  for (const event of events) {
    const date = localDate(event.dateTime);
    const [year, month] = date.split("-").map(Number);

    // Unique filename, handle same-date collisions -------------------------
    let filename = `${date}.md`;
    if (usedFilenames.has(filename)) {
      let n = 2;
      while (usedFilenames.has(`${date}-${n}.md`)) n++;
      filename = `${date}-${n}.md`;
    }
    usedFilenames.add(filename);

    const slug = filename.replace(/\.md$/, ""); // e.g. "2021-10-06"

    // Build images array ---------------------------------------------------
    const images: string[] = [];

    // 1. Local images first for Crypto Wednesday events
    if (isCryptoWednesday(event.title)) {
      images.push(...getLocalImages(year, month));
    }

    // 2. Meetup cover photo — download and reference locally
    if (event.coverPhotoUrl) {
      const imgFile = `${slug}.jpg`;
      const imgDest = path.join(PUBLIC_IMAGES, "meetup", imgFile);
      const ok = await downloadImage(event.coverPhotoUrl, imgDest);
      images.push(ok ? `/images/meetup/${imgFile}` : event.coverPhotoUrl);
    }

    // Write ---------------------------------------------------------------
    const frontmatter = buildFrontmatter(event, images);
    const body = event.description.trim();
    const content = body
      ? `${frontmatter}\n\n${body}\n`
      : `${frontmatter}\n`;

    fs.writeFileSync(path.join(EVENTS_DIR, filename), content, "utf-8");

    const localCount = images.filter((u) => u.startsWith("/images/")).length;
    const remoteCount = images.filter((u) => u.startsWith("http")).length;
    const imgNote = images.length > 0
      ? ` [${localCount} local${remoteCount > 0 ? ` + ${remoteCount} remote` : ""}]`
      : " [no images]";
    console.log(`  ${filename}  ${event.title}${imgNote}`);
  }

  console.log(`\nDone — ${events.length} files written to src/content/events/`);
}

main().catch(console.error);
