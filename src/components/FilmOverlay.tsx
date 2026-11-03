import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';

const DUST_COUNT = 45;

// Partikel debu melayang pelan, bikin gambar tidak pernah benar-benar diam.
const Dust: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{mixBlendMode: 'screen'}}>
      {Array.from({length: DUST_COUNT}, (_, i) => {
        const speed = 0.3 + random(`speed-${i}`) * 0.9;
        const size = 2 + random(`size-${i}`) * 4;
        const x = random(`x-${i}`) * width + Math.sin(frame / (40 + i) + i) * 30;
        const y = (((random(`y-${i}`) * height - frame * speed) % height) + height) % height;
        const twinkle = 0.5 + 0.5 * Math.sin(frame / (12 + (i % 7)) + i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'rgba(255, 230, 190, 1)',
              opacity: (0.12 + random(`o-${i}`) * 0.3) * twinkle,
              filter: size > 4 ? 'blur(1.5px)' : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// Grain film + vignette + kedip halus + cahaya hangat yang bergeser, nuansa arsip/dokumenter.
export const FilmOverlay: React.FC<{grain?: number}> = ({grain = 1}) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 12;
  const flicker = 0.03 + random(`flicker-${Math.floor(frame / 3)}`) * 0.03;
  const leakX = 50 + Math.sin(frame / 90) * 45;
  const leakY = 30 + Math.cos(frame / 110) * 25;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${leakX}% ${leakY}%, rgba(255, 170, 80, 0.16) 0%, rgba(255, 170, 80, 0) 45%)`,
          mixBlendMode: 'screen',
        }}
      />
      <Dust />
      {grain > 0 ? (
        <svg width="100%" height="100%" style={{position: 'absolute', opacity: 0.14 * grain, mixBlendMode: 'overlay'}}>
          <filter id={`grain-${seed}`}>
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
        </svg>
      ) : null}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.65) 100%)'}}
      />
      <AbsoluteFill style={{backgroundColor: `rgba(255, 240, 210, ${flicker})`, mixBlendMode: 'soft-light'}} />
    </AbsoluteFill>
  );
};
