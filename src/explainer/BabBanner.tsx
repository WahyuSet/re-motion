import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {explainerTheme} from './theme';
import {useProfil} from './useProfil';

const TAMPIL = 90;
const KELUAR = 12;

/** Kartu kecil "BAB N · JUDUL" di kanan atas selama 3 detik pertama scene pembuka bab. */
export const BabBanner: React.FC<{nomor: number; judul: string}> = ({nomor, judul}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {bab: tata} = useProfil();
  if (frame >= TAMPIL) return null;

  const masuk = spring({frame, fps, config: {damping: 16, mass: 0.6}});
  const opacity = Math.min(masuk * 2, interpolate(frame, [TAMPIL - KELUAR, TAMPIL], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));

  return (
    <div
      style={{
        position: 'absolute',
        right: tata.right,
        top: tata.top,
        zIndex: 45,
        pointerEvents: 'none',
        background: explainerTheme.bannerBg,
        color: explainerTheme.bannerText,
        padding: '10px 22px',
        borderRadius: 10,
        fontFamily: explainerTheme.fontBody,
        fontWeight: 900,
        fontSize: tata.fontSize,
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
        transform: `translateX(${(1 - masuk) * 120}%)`,
        opacity,
      }}
    >
      <span style={{color: '#f5c518'}}>Bab {nomor}</span> · {judul}
    </div>
  );
};
