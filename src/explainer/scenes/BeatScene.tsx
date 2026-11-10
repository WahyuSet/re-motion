import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {frameOfWord, type TimedWord} from '../../lib/kata';
import {explainerTheme} from '../theme';
import type {BeatScene} from '../types';

export const BeatSceneView: React.FC<{
  scene: BeatScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (scene.di ? frameOfWord(words, scene.di) : null) ?? 4;
  const s = spring({frame: frame - at, fps, config: {damping: 12, mass: 0.7}});

  if (frame < at) return null;

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <Sfx name="pop" at={at} />
      <div
        style={{
          fontFamily: explainerTheme.fontBody,
          fontWeight: 800,
          fontSize: 88,
          color: explainerTheme.ink,
          transform: `translateY(-40px) scale(${s})`,
          opacity: Math.min(1, s * 2.5),
          letterSpacing: -1,
        }}
      >
        {scene.teks}
      </div>
    </AbsoluteFill>
  );
};
