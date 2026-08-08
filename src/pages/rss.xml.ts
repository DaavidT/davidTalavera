import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const profiles = (await getCollection('profiles', ({ data }) => !data.draft)).sort(
    (a, b) => +b.data.date - +a.data.date,
  );

  return rss({
    title: 'David Talavera',
    description: 'Professional experience, technical focus areas, and portfolio notes from David Talavera.',
    site: context.site ?? 'https://davidtalavera.com',
    items: profiles.map((profile) => ({
      title: profile.data.title,
      pubDate: profile.data.date,
      description: profile.data.excerpt,
      author: profile.data.author,
      link: `/experience/${profile.id}`,
    })),
  });
}
