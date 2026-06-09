import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { assemblyNumberFor } from '../../../lib/content';
import { generateOGImage } from '../../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getCollection('events', ({ data }) => !data.draft);
  return events.map((event) => ({
    params: { slug: event.slug },
    props: { event },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { event } = props;
  const assemblyNo = await assemblyNumberFor(event);

  const date = event.data.date
    .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .toUpperCase();

  const png = await generateOGImage({
    title: event.data.title,
    eyebrow: `Assembly #${assemblyNo}`,
    date,
  });

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
