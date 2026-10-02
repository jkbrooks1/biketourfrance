// Photo catalogue. Alt text describes only what is visible. Captions appear only where a sign or
// other visible text proves the place. People are not named. See docs/STYLE_GUIDE.md (Images).
import type { ImageMetadata } from 'astro';

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
    src: canalTowpath,
    alt: 'A rider with loaded panniers on a gravel towpath beside a canal, under a blue sky with a few clouds.',
  },
  cafeTable: {
    src: cafeTable,
    alt: 'Five riders in cycling jerseys sharing coffee at a café table.',
  },
  creon: {
    src: creon,
    alt: 'Two loaded touring bikes parked in front of a wooden building with a sign reading "Créon fête le vélo".',
    caption: 'Créon',
  },
  routeSigns: {
    src: routeSigns,
    alt: 'Two green signs for the Canal du Midi cycle route, one pointing left and one pointing right.',
    caption: 'Canal du Midi route signs',
  },
  hotelBike: {
    src: hotelBike,
    alt: 'A touring bike leaning against the front of a small hotel with a blue balcony.',
  },
  threeRidersHotel: {
    src: threeRidersHotel,
    alt: 'Three riders with loaded bikes standing on the pavement outside a hotel entrance.',
  },
  riderCanalPath: {
    src: riderCanalPath,
    alt: 'A rider on a pale gravel path beside a straight canal with grass on both sides.',
  },
  narrowBank: {
    src: narrowBank,
    alt: 'A rider far ahead on a narrow cobbled strip between two stretches of calm water.',
  },
  twoRidersShade: {
    src: twoRidersShade,
    alt: 'A rider in a red helmet smiling at the camera on a shaded canal path, with a second rider behind.',
  },
  pineForest: {
    src: pineForest,
    alt: 'A paved path through tall pine trees with a rider in the distance.',
  },
  church: {
    src: church,
    alt: 'A small stone church with a bell tower, with a bicycle leaning near its door.',
  },
  trainSelfie: {
    src: trainSelfie,
    alt: 'A rider taking a selfie on a train next to loaded touring bikes.',
  },
  wheelRepair: {
    src: wheelRepair,
    alt: 'Two people working on a bicycle wheel together in a workshop.',
  },
  matchingJerseys: {
    src: matchingJerseys,
    alt: 'Riders in matching cycling jerseys on a tree-lined path, with more riders behind them.',
  },
  threeRidersTown: {
    src: threeRidersTown,
    alt: 'Three riders in cycling kit posing beside a bike in a town square with a palm tree.',
  },
  greenway: {
    src: greenway,
    alt: 'A long straight paved greenway through pine woods, with one rider ahead in the distance.',
  },
  pandaAirport: {
    src: pandaAirport,
    alt: 'Illustration of a panda arriving at Bordeaux Airport with a bike case and a backpack.',
  },
  panda: {
    src: panda,
    alt: 'Illustration of a panda in an orange scarf standing beside a loaded touring bike, with the words BikeTourFrance.net.',
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
