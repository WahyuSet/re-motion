import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TimedWord} from '../lib/kata';
import {theme} from '../theme';

const MAX_WORDS = 6;

// Potong narasi jadi frasa pendek: berhenti di tanda baca atau setelah MAX_WORDS kata.
const toChunks = (words: TimedWord[]) => {
  const chunks: TimedWord[][] = [];
  let current: TimedWord[] = [];
  for (const w of words) {
    current.push(w);
    if (/[.,!?;:]$/.test(w.word) || current.length >= MAX_WORDS) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
};

// Subtitle yang mengikuti suara: satu frasa tampil, kata yang sedang diucapkan menyala.
export const Subtitle: React.FC<{words: TimedWord[]; bottom?: number}> = ({words, bottom = 70}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (!words.length) return null;

  const chunks = toChunks(words);
  const index = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    return frame >= c[0].start - 2 && (next ? frame < next[0].start - 2 : frame < c[c.length - 1].end + 20);
  });
  if (index < 0) return null;

  const chunk = chunks[index];
  const enter = spring({frame: frame - (chunk[0].start - 2), fps, config: {damping: 18, mass: 0.5}});

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom,
        display: 'flex',
        justifyContent: 'center',
        opacity: enter,
        transform: `translateY(${(1 - enter) * 24}px)`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          columnGap: '0.3em',
          maxWidth: 1500,
          padding: '14px 30px',
          borderRadius: 14,
          background: 'rgba(14, 11, 8, 0.55)',
          fontFamily: theme.fontBody,
          fontWeight: 800,
          fontSize: 50,
          lineHeight: 1.25,
        }}
      >
        {chunk.map((w, i) => {
          const spoken = frame >= w.start;
          const active = spoken && frame < w.end + 2;
          const pop = interpolate(frame - w.start, [0, 4, 9], [1, 1.12, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: w.highlight || active ? theme.gold : theme.paper,
                opacity: spoken ? 1 : 0.45,
                transform: `scale(${spoken ? pop : 1})`,
                textShadow: '0 3px 12px rgba(0,0,0,0.6)',
              }}
            >
              {w.word.replace(/\*/g, '')}
            </span>
          );
        })}
      </div>
    </div>
  );
};
