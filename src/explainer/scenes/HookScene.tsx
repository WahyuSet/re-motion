import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {TimedWord} from '../../lib/kata';
import {Stage} from '../Stage';
import {explainerTheme} from '../theme';
import {fitThumbFontSize} from '../timing';
import type {HookScene} from '../types';

const STABILO_DEFAULT = '#f5c518';
const DARK_INK = '#111a22';

const outlineShadow = (r: number) => {
  const layers: string[] = [];
  const steps = 16;
  for (const rad of [r * 0.55, r]) {
    for (let i = 0; i < steps; i++) {
      const angle = (i * Math.PI * 2) / steps;
      const dx = (Math.cos(angle) * rad).toFixed(1);
      const dy = (Math.sin(angle) * rad).toFixed(1);
      layers.push(`${dx}px ${dy}px 0 #ffffff`);
    }
  }
  return layers.join(', ');
};

export const HookSceneView: React.FC<{
  scene: HookScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  // Judul sudah utuh di frame 0 (penonton feed memutuskan geser di detik pertama);
  // setelah narasi mulai, judul cuma berdenyut kecil sekali supaya tetap terasa hidup.
  const denyut = spring({frame: frame - 10, fps, config: {damping: 10, mass: 0.6}});
  const s1 = 1 + 0.04 * Math.sin(Math.PI * Math.min(1, denyut));
  const s2 = 1 + 0.04 * Math.sin(Math.PI * Math.min(1, Math.max(0, denyut - 0.15)));

  // Batas lebar 960 px; judul pendek otomatis lebih besar. Total tinggi 2 baris tetap di bawah ~28%.
  const f1 = fitThumbFontSize(scene.baris1, 92, 960);
  const f2 = scene.baris2 ? fitThumbFontSize(scene.baris2, 84, 936) : 84;
  const stroke1 = Math.max(10, Math.round(f1 * 0.16));
  const stroke2 = Math.max(9, Math.round(f2 * 0.15));

  const allItems = [
    ...(scene.utama ? [{...scene.utama, x: scene.utama.x ?? 50, y: scene.utama.y ?? 54}] : []),
    ...(scene.items ?? []),
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: 56,
          right: 56,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontFamily: explainerTheme.fontBody,
            fontWeight: 900,
            fontSize: f1,
            lineHeight: 1.15,
            color: DARK_INK,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            WebkitTextStroke: `${Math.round(stroke1 * 0.7)}px #ffffff`,
            paintOrder: 'stroke fill',
            textShadow: outlineShadow(stroke1),
            filter: 'drop-shadow(0 10px 0 rgba(0, 0, 0, 0.9)) drop-shadow(0 16px 20px rgba(0, 0, 0, 0.55))',
            transform: `scale(${s1})`,
          }}
        >
          {scene.baris1}
        </div>
        {scene.baris2 ? (
          <div
            style={{
              background: STABILO_DEFAULT,
              padding: '12px 30px',
              borderRadius: 16,
              boxShadow: '0 10px 0 rgba(0, 0, 0, 0.55), 0 18px 24px rgba(0, 0, 0, 0.35)',
              transform: `rotate(-1deg) scale(${s2})`,
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: explainerTheme.fontBody,
                fontWeight: 900,
                fontSize: f2,
                lineHeight: 1.15,
                color: DARK_INK,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                WebkitTextStroke: `${Math.round(stroke2 * 0.7)}px #ffffff`,
                paintOrder: 'stroke fill',
                textShadow: outlineShadow(stroke2),
              }}
            >
              {scene.baris2}
            </span>
          </div>
        ) : null}
      </div>
      <Stage items={allItems} words={words} duration={scene.duration} />
    </AbsoluteFill>
  );
};
