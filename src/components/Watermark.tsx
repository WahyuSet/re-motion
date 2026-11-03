import React from 'react';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';

// Nama channel di kanan atas, halus & selalu tampil (di atas overlay film supaya tidak ikut meredup).
export const Watermark: React.FC<{text: string}> = ({text}) => {
  const L = useLayout();
  return (
    <div
      style={{
        position: 'absolute',
        top: L.watermark.top,
        right: L.watermark.right,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        opacity: 0.62,
        fontFamily: theme.fontTitle,
        fontWeight: 700,
        fontStyle: 'italic',
        fontSize: L.watermark.fontSize,
        letterSpacing: 1,
        color: theme.paper,
        textShadow: '0 2px 10px rgba(0,0,0,0.75)',
        pointerEvents: 'none',
      }}
    >
      <span style={{width: 8, height: 8, borderRadius: '50%', background: theme.gold, boxShadow: '0 1px 6px rgba(0,0,0,0.6)'}} />
      {text}
    </div>
  );
};
