export type IconName = 'welcome' | 'about' | 'portfolio' | 'cv' | 'photos' | 'testimonials' | 'contact' | 'blog';

export const navigation: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/', label: 'Welcome', icon: 'welcome' },
  { href: '/about', label: 'About', icon: 'about' },
  { href: '/portfolio', label: 'Portfolio', icon: 'portfolio' },
  { href: '/cv', label: 'CV', icon: 'cv' },
  { href: '/photos', label: 'Photos', icon: 'photos' },
  { href: '/testimonials', label: 'Testimonials', icon: 'testimonials' },
  { href: '/blog', label: 'Blog', icon: 'blog' },
  { href: '/contact', label: 'Contact', icon: 'contact' },
];
