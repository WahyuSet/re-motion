import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TimedWord} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';

// Potong narasi jadi frasa pendek: berhenti di tanda baca atau setelah maxWords kata.
const toChunks = (words: TimedWord[], maxWords: number) => {
  const chunks: TimedWord[][] = [];
  let current: TimedWord[] = [];
  for (const w of words) {
    current.push(w);
    if (/[.,!?;:]$/.test(w.word) || current.length >= maxWords) {
      chunks.push(current);
      current = [];
    }
  }
  if (current.length) chunks.push(current);
  return chunks;
};

// Garis tepi gelap di sekeliling huruf (gaya caption Shorts/TikTok), dari bayangan 8 arah.
const OUTLINE = [
  [-4, 0],
  [4, 0],
  [0, -4],
  [0, 4],
  [-3, -3],
  [3, -3],
  [-3, 3],
  [3, 3],
]
  .map(([x, y]) => `${x}px ${y}px 0 rgba(0,0,0,0.9)`)
  .concat('0 8px 24px rgba(0,0,0,0.6)')
  .join(', ');

// Subtitle yang mengikuti suara: satu frasa tampil, kata yang sedang diucapkan menyala.
// Landscape: frasa sampai 6 kata di pill gelap di bawah. Short (vertikal): 2–3 kata besar bergaris tepi
// di tengah-bawah layar, di atas area yang tertutup caption aplikasi.
export const Subtitle: React.FC<{words: TimedWord[]; bottom?: number}> = ({words, bottom}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const S = L.subtitle;
  if (!words.length) return null;

  const chunks = toChunks(words, S.maxWords);
  const index = chunks.findIndex((c, i) => {
    const next = chunks[i + 1];
    return frame >= c[0].start - 2 && (next ? frame < next[0].start - 2 : frame < c[c.length - 1].end + 20);
  });
  if (index < 0) return null;

  const chunk = chunks[index];
  const enter = spring({frame: frame - (chunk[0].start - 2), fps, config: {damping: 18, mass: 0.5}});
  const short = S.style === 'short';

  return (
    <div
      style={{
        position: 'absolute',
        left: short ? S.side : 0,
        right: short ? S.side : 0,
        ...(short ? {top: S.centerY, transform: `translateY(-50%) scale(${0.85 + 0.15 * enter})`} : {bottom: bottom ?? S.bottom, transform: `translateY(${(1 - enter) * 24}px)`}),
        display: 'flex',
        justifyContent: 'center',
        opacity: enter,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          // Short: jarak lebih lebar karena kata aktif membesar 18%
          columnGap: short ? '0.42em' : '0.3em',
          maxWidth: S.maxWidth,
          ...(short
            ? {textAlign: 'center' as const}
            : {padding: '14px 30px', borderRadius: 14, background: 'rgba(14, 11, 8, 0.55)'}),
          fontFamily: theme.fontBody,
          fontWeight: short ? 900 : 800,
          fontSize: S.fontSize,
          lineHeight: short ? 1.1 : 1.25,
        }}
      >
        {chunk.map((w, i) => {
          const spoken = frame >= w.start;
          const active = spoken && frame < w.end + 2;
          const pop = interpolate(frame - w.start, [0, 4, 9], [1, short ? 1.18 : 1.12, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                color: w.highlight || active ? theme.gold : theme.paper,
                opacity: spoken ? 1 : short ? 0.75 : 0.45,
                transform: `scale(${spoken ? pop : 1})`,
                textShadow: short ? OUTLINE : '0 3px 12px rgba(0,0,0,0.6)',
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
