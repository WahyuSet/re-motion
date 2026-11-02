import React from 'react';
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {frameOfWord, type TimedWord} from '../lib/kata';
import type {PropItem} from '../types';

// Props visual (gambar hasil generate, idealnya PNG transparan) yang muncul dengan animasi.
export const Prop: React.FC<{item: PropItem}> = ({item}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {src, x, y, width, rotate = 0, delay = 0, animation = 'pop', float = true} = item;

  const enter = spring({
    frame: frame - delay,
    fps,
    config: animation === 'pop' || animation === 'drop' ? {damping: 12, mass: 0.8} : {damping: 200},
  });

  let tx = 0;
  let ty = 0;
  let scale = 1;
  let extraRotate = 0;

  switch (animation) {
    case 'pop':
      scale = enter;
      extraRotate = (1 - enter) * -20;
      break;
    case 'drop':
      ty = interpolate(enter, [0, 1], [-500, 0]);
      break;
    case 'slide-left':
      tx = interpolate(enter, [0, 1], [700, 0]);
      break;
    case 'slide-right':
      tx = interpolate(enter, [0, 1], [-700, 0]);
      break;
    case 'fade':
      scale = interpolate(enter, [0, 1], [0.9, 1]);
      break;
  }

  const opacity = interpolate(frame - delay, [0, 8], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const t = Math.max(0, frame - delay);
  const floatY = float ? Math.sin(t / 22) * 10 : 0;
  const floatRotate = float ? Math.sin(t / 30) * 2 : 0;

  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        width,
        opacity,
        transform: `translate(-50%, -50%) translate(${tx}px, ${ty + floatY}px) scale(${scale}) rotate(${rotate + extraRotate + floatRotate}deg)`,
        filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.45))',
      }}
    />
  );
};

// `di` (kata narasi) menentukan kapan props muncul; tanpa `di` pakai `delay`.
export const Props: React.FC<{items?: PropItem[]; words?: TimedWord[]}> = ({items, words = []}) => {
  if (!items) return null;
  return (
    <>
      {items.map((item, i) => {
        const at = item.di ? frameOfWord(words, item.di) : null;
        return <Prop key={i} item={at === null ? item : {...item, delay: at}} />;
      })}
    </>
  );
};
