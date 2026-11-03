// Elemen layout bergaya "jurnalisme visual" + "sketsa vintage", diadaptasi dari aturan desain
// bang-motion (MIT, https://github.com/bangtutorial/bang-motion): tag mono, judul pendek berstabilo,
// stempel, anotasi lingkaran yang tergambar, tahun hantu, dan grid foto berulang.

import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {frameOfWord, parseWords, type TimedWord} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {Anotasi, Scene, Stempel as StempelData} from '../types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Label mono berbatas kuning. Kotaknya tersingkap dari kiri, lalu teksnya.
export const Tag: React.FC<{text: string; at: number; side?: 'left' | 'right'; top?: number; bottom?: number}> = ({
  text,
  at,
  side = 'left',
  top,
  bottom,
}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const reveal = interpolate(frame - at, [0, 10], [0, 100], {...clamp, easing: Easing.out(Easing.cubic)});
  const textIn = interpolate(frame - at, [6, 14], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        ...(bottom === undefined ? {top: top ?? L.tag.top} : {bottom}),
        [side]: L.tag.side,
        maxWidth: L.vertical ? L.judul.maxWidth : undefined,
        clipPath: side === 'left' ? `inset(0 ${100 - reveal}% 0 0)` : `inset(0 0 0 ${100 - reveal}%)`,
        background: 'rgba(10, 8, 6, 0.78)',
        [side === 'left' ? 'borderLeft' : 'borderRight']: `6px solid ${theme.highlight}`,
        padding: '10px 20px',
        fontFamily: theme.fontMono,
        fontWeight: 600,
        fontSize: L.tag.fontSize,
        letterSpacing: 3,
        textTransform: 'uppercase',
        color: theme.paper,
      }}
    >
      <span style={{opacity: textIn}}>{text}</span>
    </div>
  );
};

// Judul pendek: kata naik satu per satu, lalu kata *bertanda bintang* disapu stabilo.
export const Judul: React.FC<{text: string; at: number; top?: number}> = ({text, at, top}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const words = parseWords(text);
  return (
    <div
      style={{
        position: 'absolute',
        left: L.judul.left,
        top: top ?? L.judul.top,
        maxWidth: L.judul.maxWidth,
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: '0.3em',
        fontFamily: theme.fontTitle,
        fontWeight: 900,
        fontSize: L.judul.fontSize,
        lineHeight: 1.12,
      }}
    >
      {words.map(({word, highlight}, i) => {
        const s = spring({frame: frame - at - i * 3, fps, config: {damping: 200}, durationInFrames: 16});
        const marker = highlight
          ? interpolate(frame - at - words.length * 3 - 4 - i * 2, [0, 8], [0, 1], {...clamp, easing: Easing.out(Easing.quad)})
          : 0;
        const nextHighlighted = words[i + 1]?.highlight;
        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              opacity: s,
              transform: `translateY(${(1 - s) * 60}%) scaleY(${1 + (1 - s) * 0.3})`,
              filter: `blur(${(1 - s) * 6}px)`,
              color: marker > 0.5 ? theme.ink : theme.paper,
              textShadow: marker > 0.5 ? 'none' : '0 4px 24px rgba(0,0,0,0.7)',
            }}
          >
            {highlight ? (
              <span
                style={{
                  position: 'absolute',
                  left: -8,
                  right: nextHighlighted ? '-0.32em' : -8,
                  top: '16%',
                  bottom: '6%',
                  background: theme.highlight,
                  transform: `scaleX(${marker})`,
                  transformOrigin: 'left',
                  zIndex: -1,
                }}
              />
            ) : null}
            {word}
          </span>
        );
      })}
    </div>
  );
};

// Cap merah bergaris ganda yang menghentak masuk.
export const Stempel: React.FC<{data: StempelData; at: number}> = ({data, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const s = spring({frame: frame - at, fps, config: {damping: 11, mass: 0.6}});
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${data.x ?? L.stempel.x}%`,
        top: `${data.y ?? L.stempel.y}%`,
        transform: `translate(-50%, -50%) rotate(-8deg) scale(${2.4 - 1.4 * s})`,
        opacity: Math.min(1, s * 3) * 0.93,
        border: `7px double ${theme.red}`,
        borderRadius: 10,
        padding: '14px 36px',
        fontFamily: theme.fontYear,
        fontWeight: 800,
        fontSize: L.stempel.fontSize,
        letterSpacing: 6,
        textTransform: 'uppercase',
        color: theme.red,
        background: 'rgba(243, 234, 215, 0.1)',
        boxShadow: '0 0 0 2px rgba(217, 65, 47, 0.25)',
        whiteSpace: 'nowrap',
      }}
    >
      {data.teks}
    </div>
  );
};

// Elips "coretan tangan": sedikit lebih dari satu putaran dengan radius yang bergoyang.
const handDrawnEllipse = (a: Anotasi, seed: number) => {
  const rx = (a.w ?? 10) / 2;
  const ry = (a.h ?? a.w ?? 10) / 2;
  const points: string[] = [];
  for (let t = -0.2; t <= Math.PI * 2 + 0.45; t += 0.08) {
    const wobble = 1 + 0.05 * Math.sin(3 * t + seed) + 0.03 * Math.sin(5 * t + seed * 2);
    points.push(`${(a.x + Math.cos(t) * rx * wobble).toFixed(2)},${(a.y + Math.sin(t) * ry * wobble).toFixed(2)}`);
  }
  return `M ${points.join(' L ')}`;
};

// Lingkaran merah tergambar di atas foto, lalu labelnya tersingkap. Koordinat dalam persen container.
export const AnotasiLayer: React.FC<{items?: Anotasi[]; at: number}> = ({items, at}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  if (!items?.length) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{position: 'absolute', width: '100%', height: '100%', overflow: 'visible'}}>
        {items.map((a, i) => {
          const draw = interpolate(frame - at - i * 14, [0, 18], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
          return (
            <path
              key={i}
              d={handDrawnEllipse(a, i + 1)}
              pathLength={1}
              fill="none"
              stroke={theme.red}
              strokeWidth={6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={1}
              strokeDashoffset={1 - draw}
              style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'}}
            />
          );
        })}
      </svg>
      {items.map((a, i) => {
        if (!a.label) return null;
        const reveal = interpolate(frame - at - i * 14 - 16, [0, 8], [0, 100], clamp);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${a.x + (a.w ?? 10) / 2 + 1}%`,
              top: `${a.y - (a.h ?? a.w ?? 10) / 2}%`,
              transform: 'translateY(-50%)',
              clipPath: `inset(0 ${100 - reveal}% 0 0)`,
              background: theme.red,
              color: '#fff',
              padding: '6px 14px',
              fontFamily: theme.fontMono,
              fontWeight: 600,
              fontSize: L.anotasiLabelSize,
              letterSpacing: 2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            {a.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Tahun raksasa transparan di belakang, bergeser pelan (gaya sketsa vintage).
export const GhostYear: React.FC<{year: number | string; duration: number}> = ({year, duration}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const x = interpolate(frame, [0, duration], [80, -80]);
  const opacity = interpolate(frame, [0, 15], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity}}>
      <div
        style={{
          fontFamily: theme.fontYear,
          fontWeight: 800,
          fontSize: L.ghostSize,
          lineHeight: 1,
          color: 'rgba(227, 169, 60, 0.12)',
          WebkitTextStroke: '3px rgba(227, 169, 60, 0.45)',
          transform: `translateX(${x}px)`,
          letterSpacing: 10,
        }}
      >
        {year}
      </div>
    </AbsoluteFill>
  );
};

// Satu foto diulang jadi grid ubin yang bermunculan seiring angka menghitung.
export const UlangGrid: React.FC<{photo: string; jumlah: number; start: number; end: number; hideAt: number}> = ({
  photo,
  jumlah,
  start,
  end,
  hideAt,
}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const cols = Math.ceil(Math.sqrt((jumlah * width) / height));
  const rows = Math.ceil(jumlah / cols);
  const tileW = width / cols;
  const tileH = height / rows;
  const order = Array.from({length: cols * rows}, (_, i) => i).sort((a, b) => random(`tile-${a}`) - random(`tile-${b}`));
  const hide = interpolate(frame - hideAt, [0, 12], [1, 0], clamp);
  if (hide === 0) return null;
  return (
    <AbsoluteFill style={{opacity: hide}}>
      {order.map((cell, n) => {
        const appearAt = start + (n / order.length) * (end - start);
        const s = spring({frame: frame - appearAt, fps, config: {damping: 12, mass: 0.5}});
        if (frame < appearAt) return null;
        return (
          <div
            key={cell}
            style={{
              position: 'absolute',
              left: (cell % cols) * tileW,
              top: Math.floor(cell / cols) * tileH,
              width: tileW,
              height: tileH,
              padding: 4,
              transform: `scale(${0.5 + 0.5 * s})`,
              opacity: Math.min(1, s * 2),
            }}
          >
            <Img
              src={staticFile(photo)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: `${Math.round(random(`px-${cell}`) * 100)}% ${Math.round(random(`py-${cell}`) * 100)}%`,
                filter: 'sepia(0.35) brightness(0.55)',
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Lapisan teks scene: tag kiri atas, judul berstabilo, stempel. Waktu muncul mengikuti narasi.
// `stempelPalingCepat`: stempel tidak boleh muncul sebelum frame ini (dipakai scene fact supaya stempel
// menunggu angka besar mengecil jadi badge, tidak menimpanya).
export const SceneLayers: React.FC<{scene: Scene; words: TimedWord[]; stempelPalingCepat?: number}> = ({
  scene,
  words,
  stempelPalingCepat = 0,
}) => {
  const L = useLayout();
  const judulAt =(scene.judulDi ? frameOfWord(words, scene.judulDi) : null) ?? words[0]?.start ?? 10;
  const stempelAt = Math.max(
    stempelPalingCepat,
    (scene.stempel?.di ? frameOfWord(words, scene.stempel.di) : null) ?? Math.round(scene.duration * 0.5),
  );
  return (
    <>
      {scene.tag ? <Tag text={scene.tag} at={4} /> : null}
      {scene.judul ? <Judul text={scene.judul} at={judulAt} top={scene.tag ? L.judul.top : L.judul.topNoTag} /> : null}
      {scene.stempel ? <Stempel data={scene.stempel} at={stempelAt} /> : null}
    </>
  );
};
