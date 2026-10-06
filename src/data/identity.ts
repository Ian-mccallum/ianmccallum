import { profile } from './profile';
import { socialLinks } from './social';

// One public identity connects the biography, CV, projects, and article bylines.
export const personReference = {
  '@type': 'Person',
  '@id': 'https://www.ianmccallum.com/#person',
  name: profile.name,
  url: 'https://www.ianmccallum.com/about',
};

export const person = {
  ...personReference,
  description: profile.shortBio,
  image: 'https://www.ianmccallum.com/images/ian-mccallum-headshot.jpg',
  jobTitle: profile.title,
  homeLocation: { '@type': 'Place', name: profile.location },
  worksFor: { '@type': 'Organization', name: 'Beat the Clock', url: 'https://beatyourclock.com/' },
  affiliation: { '@type': 'CollegeOrUniversity', name: 'University of Illinois Urbana-Champaign', department: { '@type': 'EducationalOrganization', name: 'Gies College of Business' } },
  alumniOf: { '@type': 'HighSchool', name: 'Metea Valley High School' },
  knowsAbout: profile.skills,
  sameAs: socialLinks.map(({ href }) => href),
};
