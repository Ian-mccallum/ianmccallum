export const profile = {
  name: 'Ian McCallum',
  title: 'Founder & AI Engineer',
  location: 'Naperville, Illinois',
  schoolLocation: 'Champaign, Illinois',
  age: 18,
  summary: 'A builder working across practical AI systems, business execution, shipped client websites, and creative work.',
  about: [
    'I’m an 18-year-old builder from Naperville, Illinois, studying Finance and Data Science at the University of Illinois Urbana-Champaign’s Gies College of Business.',
    'Most of my time goes to Clockwork, the AI operations platform I built for Beat the Clock. It helps trades businesses recover work that disappears between a missed call and a paid invoice—while keeping every customer-facing message under the owner’s control.',
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
