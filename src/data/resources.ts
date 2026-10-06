import { TEXT } from './approved-copy';
// Verified resources only. Every item below existed on the live resources pages on 2026-10-02.
// Excluded on purpose: the desktop historical narrative (its Google Doc returns HTTP 410, deleted), and three "View" entries that were Google search links, not documents
// (ViaRhona_Tour_v2, Bordeaux Bayonne Cycling Tour Plan, Tour overview - Paris & Loire).
// Audio files stay on the existing public R2 host; see docs/SECURITY_CSP_AUDIT.md.

const AUDIO_BASE = 'https://pub-248f360f2c014eee9d9621b9c416e07c.r2.dev';

export interface AudioItem {
  title: string;
  url: string;
}

export const AUDIO_GUIDES: readonly AudioItem[] = [
  {
    title: TEXT['/resources-library/text_1'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/CDM_BTF_TourAudioOverview_00.CDM_BTFv1_CompleteAudio.m4b`,
  },
  { title: TEXT['/resources-library/text_2'], url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/001.CDM_Intro.mp3` },
  {
    title: TEXT['/resources-library/text_3'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/002.CDM_RD01.mp3`,
  },
  {
    title: TEXT['/resources-library/text_4'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/003.CDM_RD02.mp3`,
  },
  { title: TEXT['/resources-library/text_5'], url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/004.CDM_RD03.mp3` },
  {
    title: TEXT['/resources-library/text_6'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/005.CDM_RD04.mp3`,
  },
  { title: TEXT['/resources-library/text_7'], url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/005.5.CDM_REST.mp3` },
  {
    title: TEXT['/resources-library/text_8'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/006.CDM_RD05.mp3`,
  },
  {
    title: TEXT['/resources-library/text_9'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/007.CDM_RD06.mp3`,
  },
  {
    title: TEXT['/resources-library/text_10'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/008.CDM_RD07.mp3`,
  },
  {
    title: TEXT['/resources-library/text_11'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/009.CDM_RD08.mp3`,
  },
  {
    title: TEXT['/resources-library/text_12'],
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/010.CDM_RD09.mp3`,
  },
  { title: TEXT['/resources-library/text_13'], url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/011.CDM_CONCLUSION.mp3` },
];

export const FOOD_AUDIO: AudioItem = {
  title: TEXT['/resources-library/text_14'],
  url: `${AUDIO_BASE}/CDM_Food/Wolferts-Cooking_of_SW_France_Cookbook_Intro.m4b`,
};

export interface LinkItem {
  title: string;
  url: string;
  note?: string;
}

export const TEMPLATES: readonly LinkItem[] = [
  {
    title: TEXT['/resources-library/text_15'],
    url: 'https://docs.google.com/spreadsheets/d/1m4sdHeE_FftAAI5PKp1RMLtDgJ0QS6-lvSRmqauX9-U/edit?gid=1305445451#gid=1305445451',
    note: TEXT['/resources-library/text_16'],
  },
];

export const NARRATIVES: readonly LinkItem[] = [
  {
    title: TEXT['/resources-library/text_17'],
    url: 'https://docs.google.com/document/d/18O_3__-hTaXNORT5mtfvYAQsS0xZUIbGRaOEVwhp0A8/edit?usp=sharing',
    note: TEXT['/resources-library/text_18'],
  },
];

export const TRUSTED_SITES: readonly LinkItem[] = [
  { title: TEXT['/resources-library/text_19'], url: 'https://en.eurovelo.com/' },
  { title: TEXT['/resources-library/text_20'], url: 'https://en.francevelotourisme.com/' },
  { title: TEXT['/resources-library/text_21'], url: 'https://www.komoot.com/' },
  { title: TEXT['/resources-library/t_1'], url: 'https://ridewithgps.com/' },
  { title: TEXT['/resources-library/text_22'], url: 'https://af3v.org/' },
  { title: TEXT['/resources-library/text_23'], url: 'https://www.sncf-connect.com/' },
  { title: TEXT['/resources-library/text_24'], url: 'https://www.ign.fr/' },
  { title: TEXT['/resources-library/text_25'], url: 'https://www.velo-territoires.org/' },
  { title: TEXT['/resources-library/text_26'], url: 'https://www.freewheelingfrance.com/' },
  {
    title: TEXT['/resources-library/text_27'],
    url: 'https://www.adventurecycling.org/blog/what-to-look-for-touring-bike/',
  },
  { title: TEXT['/resources-library/text_28'], url: 'https://pccyclingcamp.com/' },
  { title: TEXT['/resources-library/text_29'], url: 'https://azurcycletours.com/' },
];

// The existing French-learning audio library lives on its own subdomain and is not part of this build.
export const FRENCH_AUDIO_URL = 'https://resources.biketourfrance.net/media_francais';
