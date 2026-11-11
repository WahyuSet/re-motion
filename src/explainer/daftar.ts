import {cas80} from './data/cas-80';
import {blackBox} from './data/black-box';
import {bajuKuning} from './data/baju-kuning';
import {gandumTropis} from './data/gandum-tropis';
import {sadapLims} from './data/sadap-lims';
import {efekRumahKaca} from './data/efek-rumah-kaca';
import {bpaFree} from './data/bpa-free';
import {bataZigzag} from './data/bata-zigzag';
import {kamarPanas} from './data/kamar-panas';
import {tokenListrik} from './data/token-listrik';
import type {ExplainerScript} from './types';

export const daftarExplainer: {id: string; script: ExplainerScript}[] = [
  {id: 'TokenListrik', script: tokenListrik},
  {id: 'SadapLims', script: sadapLims},
  {id: 'GandumTropis', script: gandumTropis},
  {id: 'BajuKuning', script: bajuKuning},
  {id: 'KamarPanas', script: kamarPanas},
  {id: 'BataZigzag', script: bataZigzag},
  {id: 'BpaFree', script: bpaFree},
  {id: 'EfekRumahKaca', script: efekRumahKaca},
  {id: 'BlackBox', script: blackBox},
  {id: 'Cas80', script: cas80},
];
