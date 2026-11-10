import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {frameOfWord, type TimedWord} from '../../lib/kata';
import {Stage} from '../Stage';
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
  const hasItems = Boolean(scene.items?.length);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {frame >= at ? (
        <>
          <Sfx name="pop" at={at} />
          <div
            style={{
              position: 'absolute',
              top: hasItems ? '18%' : '38%',
              left: 60,
              right: 60,
              display: 'flex',
              justifyContent: 'center',
              zIndex: 30,
            }}
          >
            <div
              style={{
                background: explainerTheme.bannerBg,
                color: explainerTheme.bannerText,
                padding: '14px 32px',
                borderRadius: 14,
                boxShadow: '0 12px 28px rgba(0,0,0,0.22)',
                fontFamily: explainerTheme.fontBody,
                fontWeight: 900,
                fontSize: hasItems || scene.teks.length > 8 ? 52 : 72,
                lineHeight: 1.2,
                textAlign: 'center',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                transform: `scale(${s})`,
                opacity: Math.min(1, s * 2.5),
              }}
            >
              {scene.teks}
            </div>
          </div>
        </>
      ) : null}
      <Stage items={scene.items} words={words} duration={scene.duration} />
    </AbsoluteFill>
  );
};
