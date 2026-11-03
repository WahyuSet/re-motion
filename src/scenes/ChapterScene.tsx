import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {GhostYear, SceneLayers} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {highlightRange, parseWords, sceneWords} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {ChapterScene as ChapterSceneData} from '../types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Kartu bab: "BAB 2" berjarak lebar menyempit, garis emas menyapu, lalu judul bab naik kata per kata
// di atas foto gelap-buram. Tanpa narasi cukup 2–3 detik; dengan narasi judul muncul saat kata
// *bertanda bintang* diucapkan.
export const ChapterScene: React.FC<{scene: ChapterSceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const C = L.chapter;
  const words = sceneWords(scene, fps);
  const judulAt = highlightRange(words)?.start ?? 16;

  const label = spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 22});
  const line = interpolate(frame, [8, 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const judul = parseWords(scene.judul);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ShotStack shots={shotsOf(scene)} duration={scene.duration} words={words} dim={0.55} blur={10} />
      <AbsoluteFill style={{opacity: 0.8}}>
        <GhostYear year={scene.nomor} duration={scene.duration} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, rgba(14,11,8,0.35) 0%, rgba(14,11,8,0.85) 100%)'}} />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', transform: `translateY(${C.offsetY}px)`}}>
        <div
          style={{
            fontFamily: theme.fontYear,
            fontWeight: 800,
            fontSize: C.labelSize,
            letterSpacing: C.labelSpacing + (1 - label) * 40,
            paddingLeft: C.labelSpacing,
            color: theme.gold,
            opacity: label,
            textTransform: 'uppercase',
          }}
        >
          Bab {scene.nomor}
        </div>
        <div style={{width: C.lineWidth * line, height: 4, background: theme.gold, margin: '22px 0 30px', boxShadow: '0 0 18px rgba(227,169,60,0.6)'}} />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            columnGap: '0.28em',
            maxWidth: C.maxWidth,
            fontFamily: theme.fontTitle,
            fontWeight: 900,
            fontSize: C.judulSize,
            lineHeight: 1.08,
          }}
        >
          {judul.map(({word, highlight}, i) => {
            const s = spring({frame: frame - judulAt - i * 3, fps, config: {damping: 200}, durationInFrames: 18});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: s,
                  transform: `translateY(${(1 - s) * 50}%)`,
                  filter: `blur(${(1 - s) * 8}px)`,
                  color: highlight ? theme.gold : theme.paper,
                  textShadow: '0 6px 30px rgba(0,0,0,0.7)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      <Props items={scene.props} words={words} />
      {/* `judul` di sini judul bab (sudah tampil di tengah), jadi lapisan judul kiri atas tidak dipakai */}
      <SceneLayers scene={{...scene, judul: undefined}} words={words} />
      <Subtitle words={words} />
    </AbsoluteFill>
  );
};
