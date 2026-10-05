import { TEXT } from './approved-copy';
// Photo catalogue. Alt text describes only what is visible. Captions appear only where a sign or
// other visible text proves the place. People are not named. See docs/STYLE_GUIDE.md (Images).
import type { ImageMetadata } from 'astro';

import heroCanalPath from '../assets/photos/hero-canal-path.jpg';
import aboutJohn from '../assets/photos/about-john.jpg';
import canalTowpath from '../assets/photos/canal-towpath-gravel.jpg';
import cafeTable from '../assets/photos/cafe-table-riders.jpg';
import creon from '../assets/photos/creon-bikes-parked.jpg';
import routeSigns from '../assets/photos/canal-du-midi-route-signs.jpg';
import hotelBike from '../assets/photos/hotel-bike-parked.jpg';
import threeRidersHotel from '../assets/photos/three-riders-hotel.jpg';
import riderCanalPath from '../assets/photos/rider-on-canal-path.jpg';
import narrowBank from '../assets/photos/rider-on-narrow-canal-bank.jpg';
import twoRidersShade from '../assets/photos/two-riders-shaded-path.jpg';
import pineForest from '../assets/photos/pine-forest-path.jpg';
import church from '../assets/photos/stone-church-bike.jpg';
import trainSelfie from '../assets/photos/train-selfie-bikes.jpg';
import wheelRepair from '../assets/photos/wheel-repair-workshop.jpg';
import matchingJerseys from '../assets/photos/riders-matching-jerseys.jpg';
import threeRidersTown from '../assets/photos/three-riders-town.jpg';
import greenway from '../assets/photos/greenway-through-pines.jpg';
import panda from '../assets/photos/panda-banner.jpg';
import pandaAirport from '../assets/photos/panda-airport-transport.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export const PHOTOS = {
  hero: {
    src: heroCanalPath,
    alt: TEXT['/photos/text_1'],
  },
  cafeTable: {
    src: cafeTable,
    alt: TEXT['/photos/text_2'],
  },
  aboutJohn: {
    src: aboutJohn,
    alt: TEXT['/photos/text_3'],
  },
  creon: {
    src: creon,
    alt: TEXT['/photos/text_4'],
    caption: TEXT['/photos/t_1'],
  },
  routeSigns: {
    src: routeSigns,
    alt: TEXT['/photos/text_5'],
    caption: TEXT['/photos/text_6'],
  },
  hotelBike: {
    src: hotelBike,
    alt: TEXT['/photos/text_7'],
  },
  threeRidersHotel: {
    src: threeRidersHotel,
    alt: TEXT['/photos/text_8'],
  },
  riderCanalPath: {
    src: riderCanalPath,
    alt: TEXT['/photos/text_9'],
  },
  narrowBank: {
    src: narrowBank,
    alt: TEXT['/photos/text_10'],
  },
  twoRidersShade: {
    src: twoRidersShade,
    alt: TEXT['/photos/text_11'],
  },
  pineForest: {
    src: pineForest,
    alt: TEXT['/photos/text_12'],
  },
  church: {
    src: church,
    alt: TEXT['/photos/text_13'],
  },
  trainSelfie: {
    src: trainSelfie,
    alt: TEXT['/photos/text_14'],
  },
  wheelRepair: {
    src: wheelRepair,
    alt: TEXT['/photos/text_15'],
  },
  matchingJerseys: {
    src: matchingJerseys,
    alt: TEXT['/photos/text_16'],
  },
  threeRidersTown: {
    src: threeRidersTown,
    alt: TEXT['/photos/text_17'],
  },
  greenway: {
    src: greenway,
    alt: TEXT['/photos/text_18'],
  },
  pandaAirport: {
    src: pandaAirport,
    alt: TEXT['/photos/text_19'],
  },
  panda: {
    src: panda,
    alt: TEXT['/photos/text_20'],
  },
} satisfies Record<string, Photo>;

export const GALLERY: readonly Photo[] = [
  PHOTOS.twoRidersShade,
  PHOTOS.creon,
  PHOTOS.riderCanalPath,
  PHOTOS.routeSigns,
  PHOTOS.cafeTable,
  PHOTOS.narrowBank,
  PHOTOS.threeRidersTown,
  PHOTOS.church,
  PHOTOS.greenway,
  PHOTOS.matchingJerseys,
  PHOTOS.wheelRepair,
  PHOTOS.pineForest,
];
