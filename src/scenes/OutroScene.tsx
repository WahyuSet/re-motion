import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AnimatedText} from '../components/AnimatedText';
import {SceneLayers} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {sceneWords} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {OutroScene as OutroSceneData} from '../types';

export const OutroScene: React.FC<{scene: OutroSceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const {fps} = useVideoConfig();
  const words = sceneWords(scene, fps);

  // Tombol ajakan muncul di kalimat terakhir narasi (biasanya "ikuti channel ini ...").
  const lastSentence = words.findIndex((w, i) => i > 0 && /[.!?]$/.test(words[i - 1].word) && i > words.length / 2);
  const ctaAt = lastSentence >= 0 ? words[lastSentence].start : 40;
  const button = spring({frame: frame - ctaAt, fps, config: {damping: 10}});
  const pulse = 1 + Math.sin(Math.max(0, frame - ctaAt - 20) / 6) * 0.03;

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ShotStack shots={shotsOf(scene)} duration={scene.duration} words={words} dim={0.35} />
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, rgba(20,17,13,0.85) 0%, rgba(20,17,13,0.45) 75%)'}}
      />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: 60, marginTop: L.outro.offsetY}}>
        <AnimatedText
          text={scene.title}
          delay={5}
          style={{
            justifyContent: 'center',
            maxWidth: L.outro.maxWidth,
            fontFamily: theme.fontTitle,
            fontWeight: 900,
            fontSize: L.outro.titleSize,
            lineHeight: 1.1,
            color: theme.paper,
          }}
        />
        <div
          style={{
            fontFamily: theme.fontBody,
            fontWeight: 800,
            fontSize: L.outro.ctaSize,
            color: theme.ink,
            background: theme.gold,
            padding: '24px 56px',
            borderRadius: 999,
            opacity: Math.min(1, button * 2),
            transform: `scale(${button * pulse})`,
            boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
          }}
        >
          {scene.cta}
        </div>
      </AbsoluteFill>

      <Props items={scene.props} words={words} />
      <SceneLayers scene={scene} words={words} />
      <Subtitle words={words} />
    </AbsoluteFill>
  );
};
