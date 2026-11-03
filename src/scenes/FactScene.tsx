import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedText} from '../components/AnimatedText';
import {GhostYear, SceneLayers, UlangGrid} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {highlightRange, sceneWords} from '../lib/kata';
import {shake} from '../lib/motion';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {FactScene as FactSceneData} from '../types';

/** Jeda setelah angka selesai sebelum mengecil jadi badge di pojok (frame) */
const SETTLE_AFTER = 28;

// Angka besar yang menghitung tepat saat narator menyebut angkanya (kata *bertanda bintang*),
// lalu mengecil jadi badge di kiri atas supaya foto & anotasi di belakangnya terlihat.
export const FactScene: React.FC<{scene: FactSceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {fps} = useVideoConfig();
  const words = sceneWords(scene, fps);

  const range = highlightRange(words);
  const countStart = range?.start ?? 8;
  const countEnd = Math.max(countStart + 20, range?.end ?? 55);
  const settleAt = countEnd + SETTLE_AFTER;

  // Tahun berputar seperti odometer dari 120 tahun sebelumnya, bukan dari 0
  const countFrom = scene.format === 'year' ? scene.value - 120 : 0;
  const count = interpolate(frame, [countStart, countEnd], [countFrom, scene.value], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const rounded = Math.round(count);
  const display = scene.format === 'year' ? String(rounded) : rounded.toLocaleString('id-ID');

  const appear = spring({frame: frame - (countStart - 6), fps, config: {damping: 14}});
  const punch = interpolate(frame - countEnd, [0, 3, 12], [1, 1.12, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const label = spring({frame: frame - countEnd, fps, config: {damping: 200}});
  const settle = spring({frame: frame - settleAt, fps, config: {damping: 200}, durationInFrames: 26});
  const jolt = shake(frame, countEnd, 12);

  // Latar gelap saat angka tampil besar, lalu terang lagi setelah angka pindah ke pojok
  const dim = interpolate(frame - countStart, [-12, 6], [0.15, 0.62], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * (1 - settle * 0.75);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <AbsoluteFill style={{transform: `translate(${jolt.x}px, ${jolt.y}px) scale(1.03)`}}>
        <ShotStack shots={shotsOf(scene)} duration={scene.duration} words={words} />
        <AbsoluteFill style={{backgroundColor: `rgba(14,11,8,${dim})`}} />
        {scene.ulang ? (
          <UlangGrid
            photo={scene.ulang.photo}
            jumlah={scene.ulang.jumlah ?? 32}
            start={countStart}
            end={countEnd}
            hideAt={settleAt}
          />
        ) : null}
      </AbsoluteFill>

      {scene.format === 'year' ? (
        <AbsoluteFill style={{opacity: 1 - settle * 0.6}}>
          <GhostYear year={scene.value} duration={scene.duration} />
        </AbsoluteFill>
      ) : null}

      <AbsoluteFill style={{background: `linear-gradient(135deg, rgba(14,11,8,${0.75 * settle}) 0%, rgba(14,11,8,0) 40%)`}} />

      <div
        style={{
          position: 'absolute',
          left: interpolate(settle, [0, 1], [L.fact.centerX, L.fact.badgeX]),
          top: interpolate(settle, [0, 1], [L.fact.centerY, L.fact.badgeY]),
          transform: `translate(-50%, -50%) translate(${jolt.x * 0.6}px, ${jolt.y * 0.6}px) scale(${1 - settle * L.fact.badgeShrink})`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          style={{
            fontFamily: theme.fontTitle,
            fontWeight: 900,
            fontSize: L.fact.numberSize,
            lineHeight: 1,
            color: theme.gold,
            fontVariantNumeric: 'lining-nums tabular-nums',
            opacity: Math.min(1, appear * 1.4),
            transform: `scale(${(0.6 + appear * 0.4) * punch})`,
            textShadow: '0 10px 50px rgba(0,0,0,0.6)',
          }}
        >
          {scene.prefix}
          {display}
          {scene.suffix}
        </div>
        <div
          style={{
            alignSelf: 'stretch',
            fontFamily: theme.fontYear,
            fontWeight: 800,
            fontSize: L.fact.labelSize,
            letterSpacing: 8 + (1 - label) * 30,
            textTransform: 'uppercase',
            color: theme.paper,
            opacity: label,
            textShadow: '0 4px 20px rgba(0,0,0,0.7)',
            borderTop: `4px solid ${theme.highlight}`,
            paddingTop: 14,
            marginTop: 6,
          }}
        >
          {scene.label}
        </div>
        {!words.length && scene.sub ? (
          <AnimatedText
            text={scene.sub}
            delay={countEnd + 10}
            stagger={3}
            style={{justifyContent: 'center', maxWidth: L.fact.textMaxWidth, marginTop: 24, fontFamily: theme.fontBody, fontSize: 40, color: theme.muted}}
          />
        ) : null}
      </div>

      <Props items={scene.props} words={words} />
      <SceneLayers scene={scene} words={words} stempelPalingCepat={settleAt + 12} />
      <Subtitle words={words} />
    </AbsoluteFill>
  );
};
