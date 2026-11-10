import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHANNEL} from '../channel';
import {Stage} from './Stage';
import {explainerTheme} from './theme';
import type {ExplainerScript} from './types';

export const ExplainerThumb: React.FC<{script: ExplainerScript}> = ({script}) => {
  const thumb = script.thumbnail;
  const hook = script.scenes.find((s) => s.type === 'hook');
  const baris1 = thumb?.baris1 ?? (hook?.type === 'hook' ? hook.baris1 : 'EXPLAINER');
  const baris2 = thumb?.baris2 ?? (hook?.type === 'hook' ? hook.baris2 : undefined);
  const src = thumb?.src ?? (hook?.type === 'hook' ? hook.utama?.src : undefined);

  return (
    <AbsoluteFill style={{backgroundColor: script.bg ?? explainerTheme.bg}}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: explainerTheme.fontBody,
          fontWeight: 700,
          fontSize: 34,
          color: 'rgba(29, 24, 18, 0.09)',
          letterSpacing: 1,
        }}
      >
        {script.watermark === false ? '' : script.watermark ?? `@${CHANNEL.nama}`}
      </div>
      <div
        style={{
          position: 'absolute',
          top: '18%',
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
            padding: '16px 32px',
            fontFamily: explainerTheme.fontBody,
            fontWeight: 900,
            fontSize: 64,
            textTransform: 'uppercase',
            letterSpacing: 1,
          }}
        >
          {baris1}
        </div>
        {baris2 ? (
          <div
            style={{
              background: explainerTheme.bannerBg,
              color: explainerTheme.bannerText,
              padding: '16px 32px',
              fontFamily: explainerTheme.fontBody,
              fontWeight: 900,
              fontSize: 64,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            {baris2}
          </div>
        ) : null}
      </div>
      {src ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 220}}>
          <Img
            src={staticFile(src)}
            style={{
              width: 480,
              filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.22))',
            }}
          />
        </AbsoluteFill>
      ) : null}
      {thumb?.items ? <Stage items={thumb.items} words={[]} duration={100} /> : null}
    </AbsoluteFill>
  );
};
