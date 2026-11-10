import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import type {TimedWord} from '../lib/kata';
import {explainerTheme} from './theme';
import {potongFrasa} from './timing';

export const ExplainerSubtitle: React.FC<{
  words: TimedWord[];
  accentColor?: string;
  overPhoto?: boolean;
}> = ({words, accentColor, overPhoto = false}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const vertical = height > width;
  if (!words.length) return null;

  const frasaList = potongFrasa(words, 5, 34);
  const aktif = frasaList.find((f) => frame >= f.mulai && frame < f.selesai);
  if (!aktif) return null;

  const accent = accentColor ?? explainerTheme.accent;

  return (
    <div
      style={{
        position: 'absolute',
        left: vertical ? 72 : 140,
        right: vertical ? 72 : 140,
        bottom: vertical ? 430 : 90,
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
          fontSize: vertical ? 40 : 36,
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
