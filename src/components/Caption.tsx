import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';

// Sumber foto. Penting untuk channel sejarah: selalu cantumkan kredit foto asli.
export const Credit: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const opacity = interpolate(frame, [20, 35], [0, 0.75], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        right: L.credit.right,
        left: L.credit.left,
        bottom: L.credit.bottom,
        maxWidth: L.credit.maxWidth,
        fontFamily: theme.fontBody,
        fontSize: L.credit.fontSize,
        color: theme.paper,
        opacity,
        textShadow: '0 1px 6px rgba(0,0,0,0.8)',
      }}
    >
      {text}
    </div>
  );
};
