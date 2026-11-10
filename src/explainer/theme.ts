import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadPlexMono} from '@remotion/google-fonts/IBMPlexMono';

const inter = loadInter('normal', {weights: ['500', '700', '800', '900'], subsets: ['latin']});
const plexMono = loadPlexMono('normal', {weights: ['600', '700'], subsets: ['latin']});

export const explainerTheme = {
  fontBody: inter.fontFamily,
  fontMono: plexMono.fontFamily,
  bg: '#ddd5b8',
  ink: '#1d1812',
  bannerBg: '#0d0d0d',
  bannerText: '#ffffff',
  accent: '#1976d2',
  red: '#d93829',
  green: '#2e7d32',
  cardBg: '#ebe4cc',
  border: 'rgba(29, 24, 18, 0.18)',
};
