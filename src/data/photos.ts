import photoOne from '../assets/images/photos/gallery-quiet.jpg';
import photoTwo from '../assets/images/photos/gallery-landscape.jpg';
import photoThree from '../assets/images/photos/gallery-detail.jpg';
import photoFour from '../assets/images/photos/gallery-evening.jpg';

export const photos = [
  { src: photoOne, alt: 'A visitor in a red hockey jersey viewing a pointillist park painting in a museum' },
  { src: photoTwo, alt: 'Ian seated by a window with the Chicago skyline at sunset' },
  { src: photoThree, alt: 'A silhouetted visitor facing an illuminated domed capitol building at night' },
  { src: photoFour, alt: 'Ian and a woman standing together at an overlook at sunset' },
] as const;
