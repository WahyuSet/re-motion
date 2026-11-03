import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedText} from '../components/AnimatedText';
import {SceneLayers} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {frameOfWord, highlightRange, sceneWords} from '../lib/kata';
import {shake} from '../lib/motion';
import {fitTitleSize, useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {TitleScene as TitleSceneData} from '../types';

export const TitleScene: React.FC<{scene: TitleSceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {fps} = useVideoConfig();
  const words = sceneWords(scene, fps);
  const letters = scene.title.split('');

  // Judul menghentak muncul tepat saat namanya diucapkan narator: kata *bertanda bintang* pertama,
  // atau kata pertama judul kalau tidak ada bintang.
  const titleAt = highlightRange(words)?.start ?? frameOfWord(words, scene.title.split(' ')[0]) ?? 20;
  const kicker = spring({frame: frame - (titleAt - 12), fps, config: {damping: 200}});
  const lineWidth = interpolate(kicker, [0, 1], [0, 120]);
  const flash = interpolate(frame - titleAt, [0, 2, 10], [0, 0.35, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const jolt = shake(frame, titleAt, 16);
  const dim = interpolate(frame - titleAt, [-10, 5], [0.15, 0.45], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <AbsoluteFill style={{transform: `translate(${jolt.x}px, ${jolt.y}px) scale(1.03)`}}>
        <ShotStack shots={shotsOf(scene)} duration={scene.duration} words={words} />
        <AbsoluteFill style={{backgroundColor: `rgba(20,17,13,${dim})`}} />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,17,13,0) 50%, rgba(20,17,13,0.75) 100%)'}} />

      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          transform: `translate(${jolt.x * 0.5}px, ${jolt.y * 0.5 + L.title.offsetY}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 28, opacity: kicker}}>
          <div style={{width: lineWidth, height: 3, background: theme.gold}} />
          <div
            style={{
              fontFamily: theme.fontBody,
              fontWeight: 600,
              fontSize: L.title.kickerSize,
              letterSpacing: L.title.kickerSpacing,
              textTransform: 'uppercase',
              color: theme.gold,
            }}
          >
            {scene.kicker}
          </div>
          <div style={{width: lineWidth, height: 3, background: theme.gold}} />
        </div>

        <div style={{display: 'flex', marginTop: 20}}>
          {letters.map((letter, i) => {
            const s = spring({frame: frame - titleAt - i * 2, fps, config: {damping: 12, mass: 0.5}});
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  fontFamily: theme.fontTitle,
                  fontWeight: 900,
                  fontSize: fitTitleSize(scene.title, L),
                  lineHeight: 1.05,
                  color: theme.paper,
                  opacity: Math.min(1, s * 1.5),
                  transform: `translateY(${(1 - s) * -80}px) scale(${2.2 - s * 1.2})`,
                  filter: `blur(${(1 - Math.min(1, s)) * 12}px)`,
                  textShadow: '0 10px 40px rgba(0,0,0,0.6)',
                  whiteSpace: 'pre',
                }}
              >
                {letter}
              </span>
            );
          })}
        </div>

        {scene.subtitle ? (
          <AnimatedText
            text={scene.subtitle}
            delay={titleAt + letters.length * 2 + 8}
            style={{justifyContent: 'center', fontFamily: theme.fontBody, fontSize: L.title.subtitleSize, color: theme.muted, marginTop: 10, maxWidth: L.vertical ? L.title.maxWidth : undefined}}
          />
        ) : null}
      </AbsoluteFill>

      <AbsoluteFill style={{backgroundColor: `rgba(255, 244, 220, ${flash})`}} />
      <Props items={scene.props} words={words} />
      <SceneLayers scene={scene} words={words} />
      <Subtitle words={words} />
    </AbsoluteFill>
  );
};
