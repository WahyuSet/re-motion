import {bajuKuning} from './data/baju-kuning';
import {gandumTropis} from './data/gandum-tropis';
import {sadapLims} from './data/sadap-lims';
import {tokenListrik} from './data/token-listrik';
import type {ExplainerScript} from './types';

export const daftarExplainer: {id: string; script: ExplainerScript}[] = [
  {id: 'TokenListrik', script: tokenListrik},
  {id: 'SadapLims', script: sadapLims},
  {id: 'GandumTropis', script: gandumTropis},
  {id: 'BajuKuning', script: bajuKuning},
];
