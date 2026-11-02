import {loadFont as loadPlayfair} from '@remotion/google-fonts/PlayfairDisplay';
import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadPlexMono} from '@remotion/google-fonts/IBMPlexMono';
import {loadFont as loadCinzel} from '@remotion/google-fonts/Cinzel';

const playfair = loadPlayfair('normal', {weights: ['700', '900'], subsets: ['latin']});
const inter = loadInter('normal', {weights: ['400', '600', '800'], subsets: ['latin']});
const plexMono = loadPlexMono('normal', {weights: ['500', '600'], subsets: ['latin']});
const cinzel = loadCinzel('normal', {weights: ['600', '800'], subsets: ['latin']});

export const theme = {
  fontTitle: playfair.fontFamily,
  fontBody: inter.fontFamily,
  /** Tag, label anotasi, sumber: gaya "jurnalisme visual" */
  fontMono: plexMono.fontFamily,
  /** Tahun & nama dalam huruf kapital berjarak: gaya "sketsa vintage" */
  fontYear: cinzel.fontFamily,
  bg: '#14110d',
  paper: '#f3ead7',
  ink: '#1d1812',
  gold: '#e3a93c',
  /** Stabilo kata kunci */
  highlight: 'rgba(242, 196, 64, 0.92)',
  /** Anotasi & stempel */
  red: '#d9412f',
  muted: 'rgba(243, 234, 215, 0.7)',
};
