import type { APIRoute } from 'astro';
import { generateOGImage } from '../../lib/og';

export const GET: APIRoute = async () => {
  const png = await generateOGImage({
    title: 'DAO Brussels',
    eyebrow: 'Open Assembly',
    date: 'EVERY FIRST WEDNESDAY',
  });

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
