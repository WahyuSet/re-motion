import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHANNEL} from './channel';
import {parseWords} from './lib/kata';
import {useLayout} from './lib/layout';
import {theme} from './theme';
import type {VideoScript} from './types';

// Thumbnail YouTube (1280×720) atau cover short (1080×1920): foto penuh, gradien gelap,
// judul raksasa dengan frasa *bintang* berstabilo, label kecil, nama channel.
// Dirender oleh scripts/paket-youtube.mjs lewat Still <Id>Thumb (didaftarkan di Root.tsx).
export const Thumbnail: React.FC<{script: VideoScript}> = ({script}) => {
  const L = useLayout();
  const T = L.thumbnail;
  const data = script.thumbnail;
  if (!data) return null;

  const words = parseWords(data.judul);
  // Kecilkan judul kalau ada kata yang terlalu panjang untuk satu baris (lebar huruf Playfair 900 ±0,68 em)
  const longest = Math.max(...words.map((w) => w.word.length), 1);
  const fontSize = Math.min(T.judulSize, Math.floor(T.maxWidth / (longest * 0.68)));
  const channel = script.watermark === false ? null : (script.watermark ?? CHANNEL.nama);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <Img
        src={staticFile(data.photo)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: data.focus ? `${data.focus.x}% ${data.focus.y}%` : 'center',
          filter: 'sepia(0.15) contrast(1.12) saturate(1.05)',
        }}
      />
      <AbsoluteFill style={{background: T.gradient}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)'}} />

      <div style={{position: 'absolute', left: T.left, bottom: T.bottom, maxWidth: T.maxWidth}}>
        {data.sub ? (
          <div
            style={{
              display: 'inline-block',
              marginBottom: Math.round(fontSize * 0.22),
              background: 'rgba(10, 8, 6, 0.78)',
              borderLeft: `6px solid ${theme.highlight}`,
              padding: '8px 18px',
              fontFamily: theme.fontMono,
              fontWeight: 600,
              fontSize: T.subSize,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: theme.paper,
            }}
          >
            {data.sub}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '0.26em',
            isolation: 'isolate',
            fontFamily: theme.fontTitle,
            fontWeight: 900,
            fontSize,
            lineHeight: 1.04,
          }}
        >
          {words.map(({word, highlight}, i) => (
            <span
              key={i}
              style={{
                position: 'relative',
                display: 'inline-block',
                color: highlight ? theme.ink : theme.paper,
                textShadow: highlight ? 'none' : '0 6px 28px rgba(0,0,0,0.75)',
              }}
            >
              {highlight ? (
                <span
                  style={{
                    position: 'absolute',
                    left: '-0.1em',
                    right: words[i + 1]?.highlight ? '-0.3em' : '-0.1em',
                    top: '14%',
                    bottom: '4%',
                    background: theme.highlight,
                    zIndex: -1,
                  }}
                />
              ) : null}
              {word}
            </span>
          ))}
        </div>
      </div>

      {channel ? (
        <div
          style={{
            position: 'absolute',
            top: T.channel.top,
            right: T.channel.right,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontFamily: theme.fontTitle,
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: T.channel.fontSize,
            letterSpacing: 1,
            color: theme.paper,
            textShadow: '0 2px 10px rgba(0,0,0,0.8)',
          }}
        >
          <span style={{width: 9, height: 9, borderRadius: '50%', background: theme.gold}} />
          {channel}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
