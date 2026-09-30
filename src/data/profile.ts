export const profile = {
  name: 'Ian McCallum',
  title: 'Founder & AI Engineer',
  location: 'Naperville, Illinois',
  schoolLocation: 'Champaign, Illinois',
  age: 18,
  summary: 'A builder working across practical AI systems, business execution, shipped client websites, and creative work.',
  shortBio: 'Ian McCallum is the founder of Beat the Clock and the engineer behind Clockwork, software for home-service teams. From Naperville, Illinois, he studies Finance and Data Science at the University of Illinois Urbana-Champaign’s Gies College of Business. His work spans AI systems, client websites, and creative projects.',
  about: [
    'I’m based between Naperville and Champaign, Illinois. I like working across the technical and business sides of a project: understanding what someone needs, building the software, and making it useful in practice.',
    'Most of my time goes to Clockwork, which I build through Beat the Clock. The current application helps home-service teams with lead intake, follow-ups, and quote and invoice workflows. It combines human-reviewed drafts with configured automatic messages; a deeper residential service workflow is still in development.',
    'My work also spans custom websites for real clients, award-winning entrepreneurship through Virtual Enterprise International, and creative projects in photography, video, YouTube, and Twitch.',
  ],
  education: [
    {
      school: 'University of Illinois Urbana-Champaign',
      location: 'Champaign, IL',
      date: 'Expected Class of 2030',
      detail: 'Gies College of Business · Finance & Data Science',
    },
    {
      school: 'Metea Valley High School',
      location: 'Aurora, IL',
      date: 'Class of 2026',
      detail: '4.25 GPA · Illinois State Scholar · Magna Cum Laude · National Honor Society',
    },
  ],
  skills: ['AI systems design', 'Prompt engineering', 'LLM integration', 'Python', 'JavaScript', 'React', 'Product design', 'Client communication', 'Premiere Pro', 'After Effects', 'Photoshop'],
  interests: ['Soccer', 'Weightlifting', 'MMA', 'Fishing', 'Photography & videography', 'Video editing & content creation'],
} as const;

export const experience = [
  {
    company: 'Beat the Clock',
    role: 'Founder & Lead Engineer',
    date: 'December 2024 – Present',
    bullets: [
      'Founded the company and built Clockwork as sole architect and engineer: ten automated stages across eight screens, from catching a missed call to planning tomorrow’s schedule overnight.',
      'Designed approval-gated AI behavior, with every message drafted for owner approval and revocable, earned autonomy for specific message types.',
      'Separated deterministic pricing from model output so quotes compute from each customer’s rate card.',
      'Made model failures explicit and retryable, and recorded each outbound send in a timestamped, auditable outbox.',
      'Architected multi-tenant support with role-separated access and strict data isolation between locations.',
    ],
  },
  {
    company: 'Target',
    role: 'Food Department Team Member',
    date: 'June 2024 – Present',
    bullets: ['Deliver customer service in a fast-paced environment.', 'Stock shelves, manage inventory, and maintain department organization.', 'Handle multiple customer interactions daily, strengthening communication and problem solving.'],
  },
  {
    company: 'Coldwell Banker Dan Firks',
    role: 'Real Estate Runner · Summer Role',
    date: 'June 2025 – August 2025',
    bullets: ['Ran open-house setup and property staging across a full summer season.', 'Coordinated weekly showing logistics, transport, setup, and breakdown across multiple listings.'],
  },
  {
    company: 'Youth Soccer Referee',
    role: 'Referee',
    date: '2021 – 2024',
    bullets: ['Officiated youth matches, applying rules consistently while communicating with players, coaches, and families.'],
  },
] as const;

export const awards = [
  '1st Place, National E-Commerce Website, Virtual Enterprise International, for Luminate',
  '1st Place, Midwest Regional E-Commerce Website, Virtual Enterprise International',
  'Illinois State Scholar',
  'AP Scholar with Distinction Award',
  'Magna Cum Laude',
  'Seal of Biliteracy',
  'Soccer Sportsmanship Award',
] as const;
