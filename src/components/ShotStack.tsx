import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {frameOfWord, SHOT_OVERLAP as OVERLAP, shotStarts, type TimedWord} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {shotMove} from '../lib/motion';
import type {CameraMove, Shot} from '../types';
import {Credit} from './Caption';
import {AnotasiLayer, RuteLayer, Tag} from './Layout';
/** Anotasi mulai tergambar setelah foto mapan (frame sejak shot mulai) */
const ANOTASI_AT = 22;

// Pan di layar vertikal: geser titik crop (objectPosition) melintasi foto, 15% -> 85% lebar foto.
const verticalPanX = (move: CameraMove, p: number) =>
  move === 'pan-right' ? 15 + 70 * p : move === 'pan-left' ? 85 - 70 * p : null;

// Transform kamera untuk progres 0..1. Pan/tilt dalam persen ukuran foto.
const camera = (move: CameraMove, p: number) => {
  switch (move) {
    case 'push-in':
      return {scale: 1.08 + 0.22 * p, x: 0, y: 0};
    case 'pull-out':
      return {scale: 1.3 - 0.22 * p, x: 0, y: 0};
    case 'pan-left':
      return {scale: 1.25, x: 6 - 12 * p, y: 0};
    case 'pan-right':
      return {scale: 1.25, x: -6 + 12 * p, y: 0};
    case 'tilt-up':
      return {scale: 1.25, x: 0, y: -5 + 10 * p};
    case 'tilt-down':
      return {scale: 1.25, x: 0, y: 5 - 10 * p};
  }
};

const ShotView: React.FC<{
  shot: Shot;
  index: number;
  duration: number;
  dim: number;
  blur: number;
  fadeIn: boolean;
  /** Frame (sejak shot mulai) rute mulai tergambar */
  ruteAt: number;
  /** Hanya foto bergerak: tanpa tag, kredit, anotasi, rute; layout print diperlakukan full */
  hanyaFoto: boolean;
}> = ({shot, index, duration, dim, blur, fadeIn, ruteAt, hanyaFoto}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const move = shotMove(shot, index, L.vertical);
  const p = interpolate(frame, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });
  const cam = camera(move, p);
  const origin = shot.focus ? `${shot.focus.x}% ${shot.focus.y}%` : 'center';
  // Vertikal: pan lewat titik crop, zoom berpusat di focus (crop diarahkan ke focus)
  const panX = L.vertical ? verticalPanX(move, p) : null;
  const fullCam = panX === null ? cam : {scale: 1.06 + 0.04 * p, x: 0, y: 0};
  const objectPosition = !L.vertical
    ? undefined
    : `${panX ?? shot.focus?.x ?? 50}% ${shot.focus?.y ?? 50}%`;

  // Foto baru masuk cepat dengan sedikit zoom & blur, terasa seperti "cut" bukan slide.
  const enter = fadeIn ? interpolate(frame, [0, OVERLAP], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const enterScale = 1 + (1 - enter) * 0.08;
  const enterBlur = (1 - enter) * 12;
  const startFrom = Math.round((shot.mulai ?? 0) * fps);

  const tag = shot.tag && !hanyaFoto ? (
    <Tag text={shot.tag} at={OVERLAP + 4} side={L.shotTag.side} top={L.shotTag.top} bottom={L.shotTag.bottom} />
  ) : null;

  if ((shot.layout ?? 'full') === 'full' || hanyaFoto) {
    const fullStyle: React.CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition,
      filter: `sepia(0.15) contrast(1.08) brightness(${1 - dim}) blur(${blur + enterBlur}px)`,
    };
    return (
      <AbsoluteFill style={{overflow: 'hidden', opacity: enter}}>
        {/* Anotasi ada di dalam wadah yang sama dengan foto, jadi ikut bergerak bersama kamera */}
        <AbsoluteFill
          style={{
            transformOrigin: L.vertical ? 'center' : origin,
            transform: `scale(${fullCam.scale * enterScale}) translate(${fullCam.x}%, ${fullCam.y}%)`,
          }}
        >
          {shot.video ? (
            <OffthreadVideo src={staticFile(shot.video)} muted startFrom={startFrom} style={fullStyle} />
          ) : (
            <Img src={staticFile(shot.photo!)} style={fullStyle} />
          )}
          {hanyaFoto ? null : <AnotasiLayer items={shot.anotasi} at={ANOTASI_AT} />}
        </AbsoluteFill>
        {tag}
        {shot.credit && !hanyaFoto ? <Credit text={shot.credit} /> : null}
      </AbsoluteFill>
    );
  }

  // Layout cetakan: latar blur bergerak ke satu arah, foto cetak ke arah lain (efek kedalaman).
  const drop = spring({frame, fps, config: {damping: 14, mass: 0.7}});
  const tilt = index % 2 === 0 ? -2.2 : 1.8;
  const bgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: `scale(${1.35 + 0.1 * p}) translate(${-cam.x * 0.6}%, ${-cam.y * 0.6}%)`,
    filter: 'blur(28px) brightness(0.35) sepia(0.4)',
  };
  const printStyle: React.CSSProperties = {
    display: 'block',
    maxHeight: L.print.maxHeight,
    maxWidth: L.print.maxWidth,
    filter: `sepia(0.2) contrast(1.05)`,
  };
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: enter, backgroundColor: '#14110d'}}>
      {shot.video ? (
        <OffthreadVideo src={staticFile(shot.video)} muted startFrom={startFrom} style={bgStyle} />
      ) : (
        <Img src={staticFile(shot.photo!)} style={bgStyle} />
      )}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            padding: 18,
            paddingBottom: 26,
            background: '#efe6d2',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)',
            transform: `translate(${cam.x * 3}px, ${(1 - drop) * 120 + cam.y * 3}px) rotate(${tilt + (1 - drop) * 6}deg) scale(${(1.0 + 0.07 * p) * enterScale})`,
          }}
        >
          <div style={{position: 'relative'}}>
            {/* Ukuran mengikuti rasio asli foto/video (peta lebar tidak terpotong) */}
            {shot.video ? (
              <OffthreadVideo src={staticFile(shot.video)} muted startFrom={startFrom} style={printStyle} />
            ) : (
              <Img src={staticFile(shot.photo!)} style={printStyle} />
            )}
            <AnotasiLayer items={shot.anotasi} at={ANOTASI_AT} />
            {shot.rute && shot.photo ? <RuteLayer rute={shot.rute} photo={shot.photo} at={ruteAt} /> : null}
          </div>
        </div>
      </AbsoluteFill>
      {tag}
      {shot.credit ? <Credit text={shot.credit} /> : null}
    </AbsoluteFill>
  );
};

/** Frame (sejak shot mulai) rute mulai tergambar: saat kata `rute.di` diucapkan, default setelah anotasi */
const ruteAt = (shot: Shot, words: TimedWord[], from: number) => {
  const at = shot.rute?.di ? frameOfWord(words, shot.rute.di) : null;
  return at === null ? ANOTASI_AT + 10 : Math.max(0, at - from);
};

// Beberapa foto/video bergantian sepanjang scene, masing-masing dengan gerak kamera sendiri.
// Waktu pergantian mengikuti `di` (kata narasi) tiap shot; tanpa `di` dibagi rata.
export const ShotStack: React.FC<{
  shots: Shot[];
  duration: number;
  words?: TimedWord[];
  dim?: number;
  blur?: number;
  /** Hanya foto (dipakai bingkai foto scene kutipan; tag & kredit tampil dari ShotStack latar) */
  hanyaFoto?: boolean;
}> = ({
  shots,
  duration,
  words = [],
  dim = 0,
  blur = 0,
  hanyaFoto = false,
}) => {
  const starts = shotStarts(shots, words, duration);
  return (
    <AbsoluteFill>
      {shots.map((shot, i) => {
        const from = starts[i];
        const to = i === shots.length - 1 ? duration : starts[i + 1] + OVERLAP;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)}>
            <ShotView
              shot={shot}
              index={i}
              duration={to - from}
              dim={dim}
              blur={blur}
              fadeIn={i > 0}
              ruteAt={ruteAt(shot, words, from)}
              hanyaFoto={hanyaFoto}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

/** Ambil daftar shot scene: `shots`, atau satu `photo` sebagai satu shot */
export const shotsOf = (scene: {shots?: Shot[]; photo?: string; credit?: string}): Shot[] =>
  scene.shots ?? (scene.photo ? [{photo: scene.photo, credit: scene.credit}] : []);
