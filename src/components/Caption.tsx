import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {theme} from '../theme';

// Sumber foto. Penting untuk channel sejarah: selalu cantumkan kredit foto asli.
export const Credit: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [20, 35], [0, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        right: 50,
        bottom: 36,
        fontFamily: theme.fontBody,
        fontSize: 26,
        color: theme.paper,
        opacity,
        textShadow: '0 1px 6px rgba(0,0,0,0.8)',
      }}
    >
      {text}
    </div>
  );
};
