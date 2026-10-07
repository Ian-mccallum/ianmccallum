// Match the real Home → collection → detail-page hierarchy.
export const breadcrumbs = (section: 'blog' | 'portfolio', name: string, slug: string) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { name: 'Home', path: '/' },
    { name: section === 'blog' ? 'Blog' : 'Portfolio', path: `/${section}` },
    { name, path: `/${section}/${slug}` },
  ].map(({ name, path }, index) => ({
    '@type': 'ListItem', position: index + 1, name,
    item: new URL(path, 'https://www.ianmccallum.com').href,
  })),
});
