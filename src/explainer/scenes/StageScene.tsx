import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {frameOfWord, type TimedWord} from '../../lib/kata';
import {Stage} from '../Stage';
import {explainerTheme} from '../theme';
import type {StageScene} from '../types';

export const StageSceneView: React.FC<{
  scene: StageScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const judulAt = (scene.judulDi ? frameOfWord(words, scene.judulDi) : null) ?? 4;
  const s = spring({frame: frame - judulAt, fps, config: {damping: 15, mass: 0.7}});

  return (
    <AbsoluteFill>
      {scene.judul && frame >= judulAt ? (
        <div
          style={{
            position: 'absolute',
            top: '16%',
            left: 72,
            right: 72,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 30,
          }}
        >
          <div
            style={{
              background: explainerTheme.bannerBg,
              color: explainerTheme.bannerText,
              padding: '12px 26px',
              fontFamily: explainerTheme.fontBody,
              fontWeight: 900,
              fontSize: 48,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              transform: `scale(${0.85 + 0.15 * s})`,
              opacity: Math.min(1, s * 2),
            }}
          >
            {scene.judul}
          </div>
        </div>
      ) : null}
      <Stage items={scene.items} words={words} duration={scene.duration} />
    </AbsoluteFill>
  );
};
