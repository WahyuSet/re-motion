import {useVideoConfig} from 'remotion';
import {profilDari, type ProfilFormat} from './format';

/** Profil tata letak sesuai ukuran komposisi yang sedang dirender (short atau landscape). */
export const useProfil = (): ProfilFormat => {
  const {width, height} = useVideoConfig();
  return profilDari(width, height);
};
