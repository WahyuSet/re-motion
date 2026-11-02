import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {parseWords} from '../lib/kata';
import {theme} from '../theme';

// Teks muncul kata per kata: fade, naik, dan blur menghilang.
export const AnimatedText: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  style?: React.CSSProperties;
  highlightColor?: string;
}> = ({text, delay = 0, stagger = 4, style, highlightColor = theme.gold}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = parseWords(text);

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', ...style}}>
      {words.map(({word, highlight}, i) => {
        const s = spring({
          frame: frame - delay - i * stagger,
          fps,
          config: {damping: 200},
          durationInFrames: 20,
        });
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: s,
              transform: `translateY(${(1 - s) * 35}px)`,
              filter: `blur(${(1 - s) * 8}px)`,
              color: highlight ? highlightColor : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
