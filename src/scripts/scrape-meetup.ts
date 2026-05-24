// Scrape DAO Brussels events from Meetup.com via the /gql2 persisted-query endpoint.
// Run with: npx tsx src/scripts/scrape-meetup.ts

const GROUP = "daobrussels";
// SHA256 of the getPastGroupEvents persisted query observed in the browser.
const QUERY_HASH = "321388b1e4a11b17a57efe3ae7a90abfecbc703a4f4e99519772294924c21351";

export interface MeetupEvent {
  id: string;
  title: string;
  dateTime: string;
  endTime?: string;
  description?: string;
  status: "PAST" | "ACTIVE" | "CANCELLED";
  isOnline: boolean;
  venue?: { name: string; address: string };
  coverPhotoUrl?: string;
  eventUrl: string;
  going: number;
}

async function fetchPage(cursor?: string): Promise<{
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
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0",
      Origin: "https://www.meetup.com",
      Referer: `https://www.meetup.com/${GROUP}/events/?type=past`,
    },
    body: JSON.stringify({
      operationName: "getPastGroupEvents",
      variables,
      extensions: {
        persistedQuery: { version: 1, sha256Hash: QUERY_HASH },
      },
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status} from /gql2`);

  const json = await res.json();
  if (json.errors?.length) {
    throw new Error(`GraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  const conn = json?.data?.groupByUrlname?.events;
  if (!conn) throw new Error("Unexpected response shape from /gql2");

  const events: MeetupEvent[] = (conn.edges ?? []).map(({ node: e }: any) => ({
    id: e.id,
    title: e.title,
    dateTime: e.dateTime,
    endTime: e.endTime ?? undefined,
    description: e.description ?? undefined,
    status: e.status,
    isOnline: e.isOnline ?? false,
    venue:
      e.venue?.name && e.venue.name !== "Online event"
        ? {
            name: e.venue.name,
            address: [e.venue.address, e.venue.city].filter(Boolean).join(", "),
          }
        : undefined,
    coverPhotoUrl:
      e.displayPhoto?.highResUrl ?? e.featuredEventPhoto?.highResUrl ?? undefined,
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
    const { events, endCursor, totalCount } = await fetchPage(cursor);
    all.push(...events);
    process.stderr.write(
      `  page ${page}: ${events.length} events (${all.length}/${totalCount} total)\n`
    );
    if (!endCursor) break;
    cursor = endCursor;
    page++;
  }

  return all.sort(
    (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
  );
}

async function main() {
  console.log(`Fetching all DAO Brussels events from Meetup.com…\n`);

  const events = await fetchAllEvents();

  console.log(`\nFound ${events.length} events:\n`);
  for (const e of events) {
    const date = new Date(e.dateTime).toISOString().slice(0, 10);
    const tag = e.status === "CANCELLED" ? " [CANCELLED]" : "";
    console.log(`[${date}] ${e.title}${tag} (${e.going} going)`);
    if (e.venue) console.log(`         @ ${e.venue.name}, ${e.venue.address}`);
    else if (e.isOnline) console.log(`         @ online`);
    console.log(`         ${e.eventUrl}`);
    console.log();
  }
}

main().catch(console.error);
