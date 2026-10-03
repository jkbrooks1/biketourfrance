// Photo catalogue. Alt text and captions are approved copy fields (photos/..._alt, photos/..._caption).
// Alt text describes only what is visible. Captions appear only where a sign or other visible text
// proves the place. People are not named. See docs/STYLE_GUIDE.md (Images).
import type { ImageMetadata } from 'astro';
import { maybe, t } from '../lib/copy.mjs';

import canalTowpath from '../assets/photos/canal-towpath-gravel.jpg';
import cafeTable from '../assets/photos/cafe-table-riders.jpg';
import creon from '../assets/photos/creon-bikes-parked.jpg';
import routeSigns from '../assets/photos/canal-du-midi-route-signs.jpg';
import riderCanalPath from '../assets/photos/rider-on-canal-path.jpg';
import narrowBank from '../assets/photos/rider-on-narrow-canal-bank.jpg';
import twoRidersShade from '../assets/photos/two-riders-shaded-path.jpg';
import pineForest from '../assets/photos/pine-forest-path.jpg';
import church from '../assets/photos/stone-church-bike.jpg';
import wheelRepair from '../assets/photos/wheel-repair-workshop.jpg';
import matchingJerseys from '../assets/photos/riders-matching-jerseys.jpg';
import threeRidersTown from '../assets/photos/three-riders-town.jpg';
import greenway from '../assets/photos/greenway-through-pines.jpg';
import pandaAirport from '../assets/photos/panda-airport-transport.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption?: string;
}

export const PHOTOS = {
  hero: {
    src: canalTowpath,
    alt: t('photos/hero_alt'),
  },
  cafeTable: {
    src: cafeTable,
    alt: t('photos/cafe_table_alt'),
  },
  creon: {
    src: creon,
    alt: t('photos/creon_alt'),
    caption: maybe('photos/creon_caption'),
  },
  routeSigns: {
    src: routeSigns,
    alt: t('photos/route_signs_alt'),
    caption: maybe('photos/route_signs_caption'),
  },
  riderCanalPath: {
    src: riderCanalPath,
    alt: t('photos/rider_canal_path_alt'),
  },
  narrowBank: {
    src: narrowBank,
    alt: t('photos/narrow_bank_alt'),
  },
  twoRidersShade: {
    src: twoRidersShade,
    alt: t('photos/two_riders_shade_alt'),
  },
  pineForest: {
    src: pineForest,
    alt: t('photos/pine_forest_alt'),
  },
  church: {
    src: church,
    alt: t('photos/church_alt'),
  },
  wheelRepair: {
    src: wheelRepair,
    alt: t('photos/wheel_repair_alt'),
  },
  matchingJerseys: {
    src: matchingJerseys,
    alt: t('photos/matching_jerseys_alt'),
  },
  threeRidersTown: {
    src: threeRidersTown,
    alt: t('photos/three_riders_town_alt'),
  },
  greenway: {
    src: greenway,
    alt: t('photos/greenway_alt'),
  },
  pandaAirport: {
    src: pandaAirport,
    alt: t('photos/panda_airport_alt'),
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
