import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: { site?: URL }) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf());
  return rss({
    title: 'Ian McCallum',
    description: 'Writing on artificial intelligence, optimism about technology, and building for trades businesses.',
    site: context.site ?? new URL('https://www.ianmccallum.com'),
    items: posts.map((post) => ({ title: post.data.title, description: post.data.description, pubDate: post.data.publishedAt, link: `/blog/${post.data.slug}` })),
  });
}
