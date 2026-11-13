import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {CHANNEL} from '../channel';
import {Stage} from './Stage';
import {explainerTheme} from './theme';
import {fitThumbFontSize} from './timing';
import type {ExplainerScript} from './types';

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

export const ExplainerThumb: React.FC<{script: ExplainerScript}> = ({script}) => {
  const thumb = script.thumbnail;
  const hook = script.scenes.find((s) => s.type === 'hook');
  const baris1 = thumb?.baris1 ?? (hook?.type === 'hook' ? hook.baris1 : 'EXPLAINER');
  const baris2 = thumb?.baris2 ?? (hook?.type === 'hook' ? hook.baris2 : undefined);
  const src = thumb?.src ?? (hook?.type === 'hook' ? hook.utama?.src : undefined);
  const latar = thumb?.latar ?? (hook?.type === 'hook' ? hook.latar : undefined);
  const stabilo = thumb?.stabilo ?? STABILO_DEFAULT;

  const f1 = fitThumbFontSize(baris1, 80, 912);
  const f2 = baris2 ? fitThumbFontSize(baris2, 74, 888) : 74;
  const s1 = Math.max(10, Math.round(f1 * 0.16));
  const s2 = Math.max(9, Math.round(f2 * 0.15));

  return (
    <AbsoluteFill style={{backgroundColor: script.bg ?? DARK_INK}}>
      {latar ? (
        <Img
          src={staticFile(latar)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : null}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(11, 19, 27, 0.88) 0%, rgba(11, 19, 27, 0.62) 45%, rgba(11, 19, 27, 0.88) 100%)',
        }}
      />

      {script.watermark !== false ? (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            fontFamily: explainerTheme.fontBody,
            fontWeight: 700,
            fontSize: 34,
            color: 'rgba(255, 255, 255, 0.08)',
            letterSpacing: 1,
          }}
        >
          {script.watermark ?? `@${CHANNEL.nama}`}
        </div>
      ) : null}

      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: 56,
          right: 56,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
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
            textTransform: 'uppercase',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            letterSpacing: 0.5,
            WebkitTextStroke: `${Math.round(s1 * 0.7)}px #ffffff`,
            paintOrder: 'stroke fill',
            textShadow: outlineShadow(s1),
            filter: 'drop-shadow(0 10px 0 rgba(0, 0, 0, 0.92)) drop-shadow(0 18px 22px rgba(0, 0, 0, 0.6))',
          }}
        >
          {baris1}
        </div>

        {baris2 ? (
          <div
            style={{
              background: stabilo,
              padding: '14px 34px',
              borderRadius: 16,
              transform: 'rotate(-1deg)',
              boxShadow: '0 12px 0 rgba(0, 0, 0, 0.55), 0 20px 28px rgba(0, 0, 0, 0.38)',
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
                textTransform: 'uppercase',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                letterSpacing: 0.5,
                WebkitTextStroke: `${Math.round(s2 * 0.7)}px #ffffff`,
                paintOrder: 'stroke fill',
                textShadow: outlineShadow(s2),
              }}
            >
              {baris2}
            </span>
          </div>
        ) : null}
      </div>

      {src ? (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', paddingTop: 220}}>
          <Img
            src={staticFile(src)}
            style={{
              // Prop potret tinggi dibatasi supaya tidak naik ke judul atau turun ke tepi bawah.
              maxWidth: 560,
              maxHeight: 880,
              objectFit: 'contain',
              filter: 'drop-shadow(0 22px 34px rgba(0, 0, 0, 0.52))',
            }}
          />
        </AbsoluteFill>
      ) : null}
      {thumb?.items ? <Stage items={thumb.items} words={[]} duration={100} /> : null}
    </AbsoluteFill>
  );
};
