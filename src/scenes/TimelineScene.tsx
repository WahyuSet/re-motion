import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneLayers} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {momenUrut, sceneWords} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {TimelineScene as TimelineSceneData} from '../types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
/** Garis mulai sedikit sebelum titik pertama (px) */
const LEAD = 90;

// Garis waktu: garis tergambar bertahap, tiap titik (pin + tahun + label) muncul saat kata `di`
// diucapkan, titik terakhir yang muncul menyala emas. Landscape: garis mendatar; short: garis tegak.
// Lebih dari 4 titik: jarak tetap dan kamera bergeser mengikuti titik aktif.
export const TimelineScene: React.FC<{scene: TimelineSceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const T = L.timeline;
  const words = sceneWords(scene, fps);
  const titik = scene.titik;
  const n = titik.length;
  const muncul = momenUrut(titik, words, scene.duration);

  const view = T.end - T.start;
  const pan = n > 4;
  const spacing = pan ? T.panSpacing : view / Math.max(1, n - 1);
  const maxPan = Math.max(0, spacing * (n - 1) - view);
  const panTarget = (k: number) => Math.min(maxPan, Math.max(0, k * spacing - view / 2));
  const geser = pan
    ? muncul.reduce(
        (sum, t, k) => (k === 0 ? sum : sum + (panTarget(k) - panTarget(k - 1)) * spring({frame: frame - t + 6, fps, config: {damping: 200}, durationInFrames: 24})),
        panTarget(0),
      )
    : 0;

  // Ujung garis bergerak dari titik ke titik, selesai tepat saat titik itu muncul
  const ujung = muncul.reduce(
    (pos, t, k) => pos + (k === 0 ? LEAD : spacing) * interpolate(frame, [t - 14, t], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)}),
    T.start - LEAD,
  );
  const aktif = muncul.reduce((a, t, k) => (frame >= t ? k : a), -1);
  const posisi = (k: number) => T.start + k * spacing - geser;
  const garisAwal = T.start - LEAD - geser;
  const garisAkhir = ujung - geser;

  const lineStyle: React.CSSProperties = L.vertical
    ? {left: T.line - 2, top: garisAwal, width: 4, height: Math.max(0, garisAkhir - garisAwal)}
    : {top: T.line - 2, left: garisAwal, height: 4, width: Math.max(0, garisAkhir - garisAwal)};

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ShotStack shots={shotsOf(scene)} duration={scene.duration} words={words} dim={0.62} blur={6} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(14,11,8,0.55) 0%, rgba(14,11,8,0.2) 45%, rgba(14,11,8,0.75) 100%)'}} />

      <AbsoluteFill style={{overflow: 'hidden'}}>
        <div style={{position: 'absolute', ...lineStyle, background: theme.paper, opacity: 0.85, boxShadow: '0 0 12px rgba(0,0,0,0.6)'}} />
        {titik.map((t, k) => {
          const s = spring({frame: frame - muncul[k], fps, config: {damping: 12, mass: 0.6}});
          if (frame < muncul[k]) return null;
          const isAktif = k === aktif;
          const glow = isAktif ? interpolate(frame - muncul[k], [0, 8], [0, 1], clamp) : 0;
          const pos = posisi(k);
          // Titik yang sudah tergeser keluar area garis memudar
          const fade = interpolate(pos, [T.start - LEAD * 2, T.start - LEAD / 2], [0, 1], clamp);
          const dot = T.dot * (isAktif ? 1 : 0.7);
          const warna = isAktif ? theme.gold : theme.paper;
          const at = L.vertical ? {left: T.line, top: pos} : {left: pos, top: T.line};
          return (
            <React.Fragment key={k}>
              <div
                style={{
                  position: 'absolute',
                  ...at,
                  width: dot,
                  height: dot,
                  borderRadius: '50%',
                  background: warna,
                  opacity: fade,
                  transform: `translate(-50%, -50%) scale(${s})`,
                  boxShadow: `0 0 0 ${6 * glow}px rgba(227,169,60,0.35), 0 0 ${24 * glow}px rgba(227,169,60,0.8), 0 2px 8px rgba(0,0,0,0.6)`,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  ...(L.vertical
                    ? {left: T.line + 44, top: pos, transform: `translate(${(1 - s) * 30}px, -50%)`}
                    : {left: pos, top: T.line, transform: `translate(-50%, -100%) translateY(${-30 - (1 - s) * 30}px)`}),
                  opacity: Math.min(1, s * 1.5) * fade * (isAktif ? 1 : 0.7),
                  fontFamily: theme.fontYear,
                  fontWeight: 800,
                  fontSize: T.yearSize * (isAktif ? 1 : 0.82),
                  lineHeight: 1,
                  color: warna,
                  textShadow: '0 4px 20px rgba(0,0,0,0.8)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t.tahun}
              </div>
              <div
                style={{
                  position: 'absolute',
                  ...(L.vertical
                    ? {left: T.line + 46, top: pos + T.yearSize * 0.55, width: T.labelWidth}
                    : {left: pos - Math.min(T.labelWidth, spacing - 30) / 2, top: T.line + 34, width: Math.min(T.labelWidth, spacing - 30), textAlign: 'center' as const}),
                  opacity: interpolate(frame - muncul[k], [6, 14], [0, 1], clamp) * fade * (isAktif ? 1 : 0.65),
                  fontFamily: theme.fontMono,
                  fontWeight: 600,
                  fontSize: T.labelSize,
                  letterSpacing: 2,
                  lineHeight: 1.3,
                  textTransform: 'uppercase',
                  color: theme.paper,
                  textShadow: '0 2px 10px rgba(0,0,0,0.9)',
                }}
              >
                {t.label}
              </div>
            </React.Fragment>
          );
        })}
      </AbsoluteFill>

      <Props items={scene.props} words={words} />
      <SceneLayers scene={scene} words={words} />
      <Subtitle words={words} />
    </AbsoluteFill>
  );
};
