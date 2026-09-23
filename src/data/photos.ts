import photoOne from '../assets/images/photos/gallery-quiet.jpg';
import photoTwo from '../assets/images/photos/gallery-landscape.jpg';
import photoThree from '../assets/images/photos/gallery-detail.jpg';
import photoFour from '../assets/images/photos/gallery-evening.jpg';

export const photos = [
  { src: photoOne, alt: 'A quiet outdoor scene photographed by Ian McCallum' },
  { src: photoTwo, alt: 'A landscape photograph by Ian McCallum' },
  { src: photoThree, alt: 'An atmospheric detail photographed by Ian McCallum' },
  { src: photoFour, alt: 'An evening sky photographed by Ian McCallum' },
] as const;
