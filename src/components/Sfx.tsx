import React, {useContext} from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type SfxName = 'whoosh' | 'dum' | 'tik' | 'pop' | 'swell';

/** Volume default tiap efek suara supaya terdengar jelas tanpa menutupi narasi */
export const SFX_VOLUME: Record<SfxName, number> = {
  whoosh: 0.22,
  dum: 0.34,
  tik: 0.26,
  pop: 0.24,
  swell: 0.26,
};

export const SfxContext = React.createContext(true);

export const Sfx: React.FC<{name: SfxName; at?: number; volume?: number}> = ({name, at = 0, volume}) => {
  const enabled = useContext(SfxContext);
  if (!enabled) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? SFX_VOLUME[name]} />
    </Sequence>
  );
};
