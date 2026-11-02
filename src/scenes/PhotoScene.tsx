import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {AnimatedText} from '../components/AnimatedText';
import {SceneLayers} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {sceneWords} from '../lib/kata';
import {theme} from '../theme';
import type {PhotoScene as PhotoSceneData} from '../types';

export const PhotoScene: React.FC<{scene: PhotoSceneData}> = ({scene}) => {
  const {fps} = useVideoConfig();
  const words = sceneWords(scene, fps);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <ShotStack shots={shotsOf(scene)} duration={scene.duration} words={words} dim={0.05} />
      {/* Kantong gelap di atas (tag & judul) dan bawah (subtitle) supaya teks selalu kontras */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(14,11,8,0.7) 0%, rgba(14,11,8,0) 38%, rgba(14,11,8,0) 62%, rgba(14,11,8,0.8) 100%)',
        }}
      />

      <Props items={scene.props} words={words} />
      <SceneLayers scene={scene} words={words} />

      {words.length ? (
        <Subtitle words={words} />
      ) : scene.text ? (
        <AnimatedText
          text={scene.text}
          delay={12}
          style={{
            position: 'absolute',
            left: 110,
            right: 110,
            bottom: 110,
            maxWidth: 1400,
            fontFamily: theme.fontTitle,
            fontWeight: 700,
            fontSize: 76,
            lineHeight: 1.2,
            color: theme.paper,
            textShadow: '0 4px 24px rgba(0,0,0,0.7)',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
