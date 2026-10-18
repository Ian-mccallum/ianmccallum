// The /cv page mirrors the one-page PDF word for word; update both together.
// `**text**` marks the same bold runs the PDF uses inside bullets.

export interface ResumeEntry {
  title: string;
  date: string;
  org: string;
  place: string;
  points: string[];
}

export interface ResumeProject {
  title: string;
  href: string;
  stack: string;
  date: string;
  points: string[];
}

export interface ResumeFacts {
  label: string;
  items: string[];
}

export interface Resume {
  name: string;
  pdf: string;
  contact: { label: string; href?: string }[];
  education: ResumeEntry[];
  experience: ResumeEntry[];
  projects: ResumeProject[];
  skills: ResumeFacts[];
  honors: ResumeFacts[];
}

export const resume: Resume = {
  name: 'Ian McCallum',
  pdf: '/downloads/Ian-McCallum-CV.pdf',
  // The email stays behind the site's protected reveal rather than in page markup.
  contact: [
    { label: 'Naperville, Illinois' },
    { label: 'Email Ian', href: '/contact' },
    { label: 'ianmccallum.com', href: 'https://www.ianmccallum.com/' },
    { label: 'linkedin.com/in/mccallumian', href: 'https://www.linkedin.com/in/mccallumian' },
  ],
  education: [
    {
      title: 'University of Illinois Urbana-Champaign',
      date: 'Expected 2030',
      org: 'Gies College of Business — B.S. Finance & Data Science',
      place: 'Champaign, IL',
      points: [],
    },
  ],
  experience: [
    {
      title: 'Founder & Lead Engineer',
      date: 'Dec 2024 – Present',
      org: 'Beat the Clock',
      place: 'Naperville, IL',
      points: [
        'Founded and solely engineer an AI operations company for trades businesses, taking the product from problem interviews through architecture, build, and go-to-market.',
        'Shipped **Clockwork**, a ten-stage automated platform across eight screens that turns a missed call into a drafted reply, a priced quote, a confirmed appointment, and a collected invoice.',
      ],
    },
    {
      title: 'Lead Developer',
      date: '2025 – 2026',
      org: 'Luminate — Virtual Enterprise International',
      place: 'Aurora, IL',
      points: [
        'Led development of the full storefront for a glow-in-the-dark sports equipment brand: product catalog, curated bundles, and cart spanning training gear and party lines.',
        'Designed and coded an in-site arcade of three playable games awarding points redeemable for promo codes, giving customers a reason to return between purchases.',
        'Won **1st Place National** and **1st Place Midwest Regional** for E-Commerce Website against national competition.',
      ],
    },
    {
      title: 'Web Developer',
      date: '2023 – Present',
      org: 'Freelance',
      place: 'Naperville, IL',
      points: [
        'Shipped custom sites for paying clients including Imanol VillaGomez (concert videographer for Charli XCX and Playboi Carti), Fortivus Academy (the largest rugby program in Naperville), TMM Photography, and Nics Marketing.',
        'Ran every engagement solo from scoping through launch, handling client communication and revisions directly.',
      ],
    },
    {
      title: 'Creator, YouTube & Twitch',
      date: '2019 – 2021',
      org: 'Vokel',
      place: 'Remote',
      points: [
        'Grew a gaming channel to nearly 500 subscribers and earned Twitch Affiliate status, editing every video in Premiere Pro and After Effects.',
      ],
    },
  ],
  projects: [
    {
      title: 'Clockwork — AI Operations Platform',
      href: '/portfolio/clockwork',
      stack: 'Python, React, JavaScript, LLM APIs',
      date: 'Dec 2024 – Present',
      points: [
        'Designed the product around an approval-gated agent: every message is drafted for the owner to approve, and the agent earns permission to send a message type on its own only after enough drafts pass unedited — revocable in one tap.',
        'Separated deterministic pricing from model output so quotes compute from each customer\'s own rate card, eliminating a class of AI failure where a hallucinated number costs real money.',
        'Wrote a ten-rule voice specification for the agent and enforced it in the test suite (any violation fails the build), and architected multi-tenant support with strict data isolation between locations.',
      ],
    },
    {
      title: 'beatyourclock.com',
      href: 'https://beatyourclock.com/',
      stack: 'JavaScript, HTML, CSS',
      date: '2025',
      points: [
        'Built the company site end to end, including an interactive product simulation and a free assessment tool that quantifies the revenue hours a shop loses each week.',
      ],
    },
  ],
  skills: [
    { label: 'Languages', items: ['Python', 'JavaScript', 'HTML', 'CSS'] },
    { label: 'Frameworks & Tools', items: ['React', 'Git', 'Premiere Pro', 'After Effects'] },
    { label: 'AI & Systems', items: ['Agent design', 'prompt engineering', 'LLM integration', 'human-in-the-loop approval workflows', 'automated testing of model output', 'multi-tenant architecture'] },
    { label: 'Integrations', items: ['Messaging/SMS', 'payments', 'scheduling', 'invoicing'] },
  ],
  honors: [
    { label: 'Awards', items: ['1st Place National & 1st Place Midwest Regional, E-Commerce Website (VEI)', 'Illinois State Scholar', 'AP Scholar with Distinction', 'Magna Cum Laude', 'Seal of Biliteracy'] },
    { label: 'Activities', items: ['National Honor Society', 'UNICEF Club, Board Member', 'Youth Soccer Referee (2021–2024)'] },
    { label: 'Additional Work', items: ['Target, Food Dept. (2024–Present)', 'Coldwell Banker Dan Firks, Real Estate Runner (Summer 2025)'] },
  ],
};
