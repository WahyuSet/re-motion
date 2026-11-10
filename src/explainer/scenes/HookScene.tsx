import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TimedWord} from '../../lib/kata';
import {Stage} from '../Stage';
import {explainerTheme} from '../theme';
import type {HookScene} from '../types';

export const HookSceneView: React.FC<{
  scene: HookScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s1 = spring({frame, fps, config: {damping: 14, mass: 0.7}});
  const s2 = spring({frame: frame - 4, fps, config: {damping: 14, mass: 0.7}});

  const allItems = [
    ...(scene.utama ? [{...scene.utama, x: scene.utama.x ?? 50, y: scene.utama.y ?? 54}] : []),
    ...(scene.items ?? []),
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: '17%',
          left: 60,
          right: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          zIndex: 30,
        }}
      >
        <div
          style={{
            background: explainerTheme.bannerBg,
            color: explainerTheme.bannerText,
            padding: '14px 30px',
            fontFamily: explainerTheme.fontBody,
            fontWeight: 900,
            fontSize: 60,
            letterSpacing: 1,
            textTransform: 'uppercase',
            transform: `scale(${0.85 + 0.15 * s1})`,
            opacity: Math.min(1, s1 * 2),
          }}
        >
          {scene.baris1}
        </div>
        {scene.baris2 ? (
          <div
            style={{
              background: explainerTheme.bannerBg,
              color: explainerTheme.bannerText,
              padding: '14px 30px',
              fontFamily: explainerTheme.fontBody,
              fontWeight: 900,
              fontSize: 60,
              letterSpacing: 1,
              textTransform: 'uppercase',
              transform: `scale(${0.85 + 0.15 * s2})`,
              opacity: Math.min(1, s2 * 2),
            }}
          >
            {scene.baris2}
          </div>
        ) : null}
      </div>
      <Stage items={allItems} words={words} duration={scene.duration} />
    </AbsoluteFill>
  );
};
