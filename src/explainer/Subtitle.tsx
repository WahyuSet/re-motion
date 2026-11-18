import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {TimedWord} from '../lib/kata';
import {explainerTheme} from './theme';
import {potongFrasa} from './timing';
import {useProfil} from './useProfil';

export const ExplainerSubtitle: React.FC<{
  words: TimedWord[];
  accentColor?: string;
  overPhoto?: boolean;
}> = ({words, accentColor, overPhoto = false}) => {
  const frame = useCurrentFrame();
  const {subtitle: tata} = useProfil();
  if (!words.length) return null;

  const frasaList = potongFrasa(words, 5, 34);
  const aktif = frasaList.find((f) => frame >= f.mulai && frame < f.selesai);
  if (!aktif) return null;

  const accent = accentColor ?? explainerTheme.accent;

  return (
    <div
      style={{
        position: 'absolute',
        left: tata.side,
        right: tata.side,
        bottom: tata.bottom,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 40,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          columnGap: '0.28em',
          rowGap: 4,
          textAlign: 'center',
          fontFamily: explainerTheme.fontBody,
          fontWeight: 700,
          fontSize: tata.fontSize,
          lineHeight: 1.25,
          color: explainerTheme.ink,
          background: overPhoto ? 'rgba(244, 239, 230, 0.94)' : undefined,
          padding: overPhoto ? '10px 22px' : undefined,
          borderRadius: overPhoto ? 12 : undefined,
          boxShadow: overPhoto ? '0 8px 20px rgba(0,0,0,0.28)' : undefined,
        }}
      >
        {aktif.kata.map((w, i) => (
          <span
            key={i}
            style={{
              color: w.highlight ? accent : explainerTheme.ink,
              fontWeight: w.highlight ? 800 : 700,
            }}
          >
            {w.word}
          </span>
        ))}
      </div>
    </div>
  );
};
