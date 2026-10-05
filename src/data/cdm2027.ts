import { TEXT } from './approved-copy';
// Authoritative 2027 Canal des Deux Mers content. The home page and the CDM page both read from here.
// Source of each fact: docs/2027_CDM_CONTENT_AUTHORITY.md. Do not add dates, prices, deposits,
// cancellation terms, or supplier promises here until the owner approves them.

export const CDM_FACTS = {
  departures: TEXT['/cdm-facts/copy_1'],
  datesNote: TEXT['/cdm-facts/copy_2'],
  pricingNote: TEXT['/cdm-facts/copy_3'],
  route: TEXT['/cdm-facts/copy_4'],
  ridingDays: 9,
  restDays: 1,
  nights: 11,
  minRiders: 6,
  targetRiders: 8,
  maxRiders: 12,
} as const;

export const CDM_STATS = [
  { value: '4', label: TEXT['/cdm-facts/text_1'] },
  { value: '9', label: TEXT['/cdm-facts/text_2'] },
  { value: '1', label: TEXT['/cdm-facts/t_1'] },
  { value: '11', label: TEXT['/cdm-facts/stat_nights'] },
] as const;

export const INCLUDED: readonly string[] = [
  TEXT['/cdm-facts/copy_5'],
  TEXT['/cdm-facts/copy_6'],
  TEXT['/cdm-facts/copy_7'],
  TEXT['/cdm-facts/copy_8'],
  TEXT['/cdm-facts/copy_9'],
  TEXT['/cdm-facts/copy_10'],
  TEXT['/cdm-facts/copy_11'],
  TEXT['/cdm-facts/copy_12'],
  TEXT['/cdm-facts/copy_13'],
];

export const SEPARATE: readonly string[] = [
  TEXT['/cdm-facts/copy_14'],
  TEXT['/cdm-facts/copy_15'],
  TEXT['/cdm-facts/copy_16'],
  TEXT['/cdm-facts/copy_17'],
  TEXT['/cdm-facts/copy_18'],
  TEXT['/cdm-facts/copy_19'],
  TEXT['/cdm-facts/copy_20'],
];

export const SELF_SUPPORTED_POINTS: readonly string[] = [
  TEXT['/cdm-facts/copy_21'],
  TEXT['/cdm-facts/copy_22'],
  TEXT['/cdm-facts/copy_23'],
];

export const WEEK_PLAN: readonly { day: string; text: string }[] = [
  { day: TEXT['/cdm-facts/t_2'], text: TEXT['/cdm-facts/text_3'] },
  { day: TEXT['/cdm-facts/t_3'], text: TEXT['/cdm-facts/text_4'] },
  {
    day: TEXT['/cdm-facts/t_4'],
    text: TEXT['/cdm-facts/text_5'],
  },
  { day: TEXT['/cdm-facts/t_5'], text: TEXT['/cdm-facts/text_6'] },
  { day: TEXT['/cdm-facts/t_6'], text: TEXT['/cdm-facts/text_7'] },
];

export const STOPS: readonly string[] = [
  TEXT['/cdm-facts/t_7'],
  TEXT['/cdm-facts/t_8'],
  TEXT['/cdm-facts/t_9'],
  TEXT['/cdm-facts/t_10'],
  TEXT['/cdm-facts/copy_24'],
  TEXT['/cdm-facts/t_11'],
  TEXT['/cdm-facts/t_12'],
  TEXT['/cdm-facts/t_13'],
  TEXT['/cdm-facts/t_14'],
  TEXT['/cdm-facts/t_15'],
];

export const TOULOUSE_DINNER = {
  text: TEXT['/cdm-facts/text_8'],
  dress:
    TEXT['/cdm-facts/copy_25'],
} as const;
