import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const pods = await getCollection('pods', ({ data }) => !data.draft);
  return pods.map((pod) => ({
    params: { slug: pod.slug },
    props: { pod },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { pod } = props;

  const png = await generateOGImage({
    title: pod.data.title,
    eyebrow: 'Pod',
    date: pod.data.status.toUpperCase(),
  });

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
