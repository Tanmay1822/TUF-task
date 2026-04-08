/**
 * Month Theme System
 * Each month has a unique visual identity with full color palette,
 * particle type, and mood classification.
 * Background images served from /images/ directory.
 */

const MONTH_IMAGE_FILES = [
  '/images/jan.png',    // 0 - January
  '/images/feb.png',    // 1 - February
  '/images/mar.png',    // 2 - March
  '/images/april.png',  // 3 - April
  '/images/may.png',    // 4 - May
  '/images/june.png',   // 5 - June
  '/images/july.png',   // 6 - July
  '/images/aug.png',    // 7 - August
  '/images/sept.png',   // 8 - September
  '/images/oct.png',    // 9 - October
  '/images/nov.png',    // 10 - November
  '/images/dec.png',    // 11 - December
];

export const MONTH_THEMES = {
  0: { // January
    bgImage: MONTH_IMAGE_FILES[0],
    accent: '#4A90D9',
    accentLight: 'rgba(74,144,217,0.15)',
    gradient: 'linear-gradient(135deg, #1a2a4a, #2d5a8e)',
    textAccent: '#7DB8F0',
    particle: 'snow',
    weekendTint: 'rgba(74,144,217,0.08)',
    todayBg: '#4A90D9',
    headerMood: 'cold',
  },
  1: { // February
    bgImage: MONTH_IMAGE_FILES[1],
    accent: '#E8789A',
    accentLight: 'rgba(232,120,154,0.15)',
    gradient: 'linear-gradient(135deg, #3d1a2a, #7a3050)',
    textAccent: '#F0A0BC',
    particle: 'petals',
    weekendTint: 'rgba(232,120,154,0.08)',
    todayBg: '#E8789A',
    headerMood: 'romantic',
  },
  2: { // March - Holi
    bgImage: MONTH_IMAGE_FILES[2],
    accent: '#E85D9A',
    accentLight: 'rgba(232,93,154,0.15)',
    gradient: 'linear-gradient(135deg, #2a0a3a, #5a1a7a)',
    textAccent: '#F090C0',
    particle: 'powder',
    weekendTint: 'rgba(255,100,100,0.08)',
    todayBg: '#9B59B6',
    headerMood: 'festive',
  },
  3: { // April
    bgImage: MONTH_IMAGE_FILES[3],
    accent: '#4CAF7D',
    accentLight: 'rgba(76,175,125,0.15)',
    gradient: 'linear-gradient(135deg, #0d2a1a, #1a5c35)',
    textAccent: '#80D4A8',
    particle: 'leaves',
    weekendTint: 'rgba(76,175,125,0.08)',
    todayBg: '#4CAF7D',
    headerMood: 'fresh',
  },
  4: { // May
    bgImage: MONTH_IMAGE_FILES[4],
    accent: '#F5A623',
    accentLight: 'rgba(245,166,35,0.15)',
    gradient: 'linear-gradient(135deg, #2a1a00, #5c3a00)',
    textAccent: '#FAC85A',
    particle: 'rays',
    weekendTint: 'rgba(245,166,35,0.08)',
    todayBg: '#F5A623',
    headerMood: 'warm',
  },
  5: { // June
    bgImage: MONTH_IMAGE_FILES[5],
    accent: '#2196F3',
    accentLight: 'rgba(33,150,243,0.15)',
    gradient: 'linear-gradient(135deg, #001a3a, #003d7a)',
    textAccent: '#64B5F6',
    particle: 'bubbles',
    weekendTint: 'rgba(33,150,243,0.08)',
    todayBg: '#2196F3',
    headerMood: 'ocean',
  },
  6: { // July - Monsoon
    bgImage: MONTH_IMAGE_FILES[6],
    accent: '#546E7A',
    accentLight: 'rgba(84,110,122,0.15)',
    gradient: 'linear-gradient(135deg, #0a1a20, #1a3a48)',
    textAccent: '#90A4AE',
    particle: 'rain',
    weekendTint: 'rgba(84,110,122,0.08)',
    todayBg: '#546E7A',
    headerMood: 'monsoon',
  },
  7: { // August - Independence
    bgImage: MONTH_IMAGE_FILES[7],
    accent: '#FF9933',
    accentLight: 'rgba(255,153,51,0.15)',
    gradient: 'linear-gradient(135deg, #1a0f00, #138808)',
    textAccent: '#FFB366',
    particle: 'flags',
    weekendTint: 'rgba(255,153,51,0.08)',
    todayBg: '#FF9933',
    headerMood: 'patriotic',
  },
  8: { // September
    bgImage: MONTH_IMAGE_FILES[8],
    accent: '#D4843A',
    accentLight: 'rgba(212,132,58,0.15)',
    gradient: 'linear-gradient(135deg, #2a1500, #5c3300)',
    textAccent: '#E8A86A',
    particle: 'leaves',
    weekendTint: 'rgba(212,132,58,0.08)',
    todayBg: '#D4843A',
    headerMood: 'harvest',
  },
  9: { // October - Diwali
    bgImage: MONTH_IMAGE_FILES[9],
    accent: '#F4C430',
    accentLight: 'rgba(244,196,48,0.15)',
    gradient: 'linear-gradient(135deg, #1a0f00, #3d2400)',
    textAccent: '#F8D870',
    particle: 'sparkle',
    weekendTint: 'rgba(244,196,48,0.08)',
    todayBg: '#F4C430',
    headerMood: 'diwali',
  },
  10: { // November
    bgImage: MONTH_IMAGE_FILES[10],
    accent: '#8E6BAE',
    accentLight: 'rgba(142,107,174,0.15)',
    gradient: 'linear-gradient(135deg, #1a0f2a, #3a2458)',
    textAccent: '#B89FD0',
    particle: 'mist',
    weekendTint: 'rgba(142,107,174,0.08)',
    todayBg: '#8E6BAE',
    headerMood: 'misty',
  },
  11: { // December
    bgImage: MONTH_IMAGE_FILES[11],
    accent: '#C5A028',
    accentLight: 'rgba(197,160,40,0.15)',
    gradient: 'linear-gradient(135deg, #060d1a, #0d1f3c)',
    textAccent: '#E8CB6A',
    particle: 'snow',
    weekendTint: 'rgba(197,160,40,0.08)',
    todayBg: '#C5A028',
    headerMood: 'festive',
  },
};
