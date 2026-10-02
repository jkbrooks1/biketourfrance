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
    title: 'Complete Canal des Deux Mers audio route guide',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/00.CDM2026_CompleteAudio.m4b`,
  },
  { title: 'Introduction', url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/001.CDM_Intro.mp3` },
  {
    title: 'Riding day 1: Bordeaux to La Réole',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/002.CDM_RD01.mp3`,
  },
  {
    title: 'Riding day 2: La Réole to Agen',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/003.CDM_RD02.mp3`,
  },
  { title: 'Riding day 3: Agen to Moissac', url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/004.CDM_RD03.mp3` },
  {
    title: 'Riding day 4: Moissac to Toulouse',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/005.CDM_RD04.mp3`,
  },
  { title: 'Toulouse rest day', url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/005.5.CDM_REST.mp3` },
  {
    title: 'Riding day 5: Toulouse to Castelnaudary',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/006.CDM_RD05.mp3`,
  },
  {
    title: 'Riding day 6: Castelnaudary to Carcassonne',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/007.CDM_RD06.mp3`,
  },
  {
    title: 'Riding day 7: Carcassonne to Lézignan-Corbières',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/008.CDM_RD07.mp3`,
  },
  {
    title: 'Riding day 8: Lézignan-Corbières to Capestang',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/009.CDM_RD08.mp3`,
  },
  {
    title: 'Riding day 9: Capestang to Sète',
    url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/010.CDM_RD09.mp3`,
  },
  { title: 'Conclusion', url: `${AUDIO_BASE}/CDM_BTF_TourAudioOverview/011.CDM_CONCLUSION.mp3` },
];

export const FOOD_AUDIO: AudioItem = {
  title: 'The Cooking of Southwest France: introduction',
  url: `${AUDIO_BASE}/CDM_Food/Wolferts-Cooking_of_SW_France_Cookbook_Intro.m4b`,
};

export interface LinkItem {
  title: string;
  url: string;
  note?: string;
}

export const TEMPLATES: readonly LinkItem[] = [
  {
    title: 'Bicycle Touring Pack List v2',
    url: 'https://docs.google.com/spreadsheets/d/1m4sdHeE_FftAAI5PKp1RMLtDgJ0QS6-lvSRmqauX9-U/edit?gid=1305445451#gid=1305445451',
    note: 'A Google Sheet. Copy it and change it to fit your trip.',
  },
];

export const NARRATIVES: readonly LinkItem[] = [
  {
    title: 'Canal des Deux Mers historical narrative, mobile version',
    url: 'https://docs.google.com/document/d/18O_3__-hTaXNORT5mtfvYAQsS0xZUIbGRaOEVwhp0A8/edit?usp=sharing',
    note: 'Written for the 2026 tour. The history of the route has not changed. Formatted for a phone.',
  },
];

export const TRUSTED_SITES: readonly LinkItem[] = [
  { title: 'EuroVelo', url: 'https://en.eurovelo.com/' },
  { title: 'France Vélo Tourisme', url: 'https://en.francevelotourisme.com/' },
  { title: 'Komoot', url: 'https://www.komoot.com/' },
  { title: 'RideWithGPS', url: 'https://ridewithgps.com/' },
  { title: 'AF3V (French greenways)', url: 'https://af3v.org/' },
  { title: 'SNCF Connect', url: 'https://www.sncf-connect.com/' },
  { title: 'IGN (French national geographic institute)', url: 'https://www.ign.fr/' },
  { title: 'Vélo & Territoires', url: 'https://www.velo-territoires.org/' },
  { title: 'FreeWheelingFrance.com', url: 'https://www.freewheelingfrance.com/' },
  {
    title: 'Adventure Cycling Association: what to look for in a touring bike',
    url: 'https://www.adventurecycling.org/blog/what-to-look-for-touring-bike/',
  },
  { title: 'Peak & Coast Cycling Camp', url: 'https://pccyclingcamp.com/' },
  { title: 'Azure Cycle Tours', url: 'https://azurcycletours.com/' },
];

// The existing French-learning audio library lives on its own subdomain and is not part of this build.
export const FRENCH_AUDIO_URL = 'https://resources.biketourfrance.net/media_francais';
