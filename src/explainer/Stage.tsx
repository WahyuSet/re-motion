import React, {useContext} from 'react';
import {Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {SfxContext} from '../components/Sfx';
import {parseWords, type TimedWord} from '../lib/kata';
import {explainerTheme} from './theme';
import {hitungTransformItem, waktuItem} from './timing';
import type {ExplainerSfxName, StageItem, StageSymbolType} from './types';

const EXPLAINER_SFX_VOL: Record<ExplainerSfxName, number> = {
  whoosh: 0.22,
  dum: 0.34,
  tik: 0.26,
  pop: 0.22,
  swell: 0.26,
  boing: 0.3,
  boom: 0.36,
  womp: 0.32,
  slap: 0.3,
  ding: 0.28,
};

export const ExplainerSfx: React.FC<{name: ExplainerSfxName; at?: number; volume?: number}> = ({
  name,
  at = 0,
  volume,
}) => {
  const enabled = useContext(SfxContext);
  if (!enabled) return null;
  return (
    <Sequence from={Math.max(0, Math.round(at))} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume ?? EXPLAINER_SFX_VOL[name]} />
    </Sequence>
  );
};

const SymbolSvg: React.FC<{simbol: StageSymbolType; width: number; warna?: string; progress?: number}> = ({
  simbol,
  width,
  warna,
  progress = 1,
}) => {
  const strokeRed = warna ?? explainerTheme.red;
  switch (simbol) {
    case 'larang':
      return (
        <svg width={width} height={width} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke={strokeRed} strokeWidth="12" />
          <line x1="25" y1="25" x2="95" y2="95" stroke={strokeRed} strokeWidth="12" strokeLinecap="round" />
        </svg>
      );
    case 'centang':
      return (
        <svg width={width} height={width} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="rgba(46, 125, 50, 0.14)" stroke={warna ?? explainerTheme.green} strokeWidth="10" />
          <path d="M 34 62 L 52 80 L 88 42" fill="none" stroke={warna ?? explainerTheme.green} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'silang':
      return (
        <svg width={width} height={width} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="rgba(229, 57, 53, 0.14)" stroke={strokeRed} strokeWidth="10" />
          <line x1="38" y1="38" x2="82" y2="82" stroke={strokeRed} strokeWidth="12" strokeLinecap="round" />
          <line x1="82" y1="38" x2="38" y2="82" stroke={strokeRed} strokeWidth="12" strokeLinecap="round" />
        </svg>
      );
    case 'panah':
      return (
        <svg width={width} height={width * 0.6} viewBox="0 0 140 84">
          <line x1="12" y1="42" x2="112" y2="42" stroke={strokeRed} strokeWidth="12" strokeLinecap="round" />
          <path d="M 92 18 L 124 42 L 92 66" fill="none" stroke={strokeRed} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'tanya': {
      const qColor = warna ?? explainerTheme.red;
      return (
        <svg width={width} height={width * 1.25} viewBox="0 0 110 140" style={{overflow: 'visible'}}>
          <filter id="q-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.32)" />
          </filter>
          <g filter="url(#q-shadow)">
            <path
              d="M 55 18 C 33 18 23 32 23 46 C 23 52 27 56 34 56 C 41 56 46 51 46 45 C 46 38 49 32 55 32 C 61 32 67 35 67 42 C 67 50 60 56 53 62 C 47 68 42 76 43 88 C 43 92 47 96 52 96 C 57 96 61 92 61 87 C 61 79 65 74 72 68 C 80 61 88 53 88 40 C 88 24 74 18 55 18 Z M 52 105 C 46.5 105 42 109.5 42 115 C 42 120.5 46.5 125 52 125 C 57.5 125 62 120.5 62 115 C 62 109.5 57.5 105 52 105 Z"
              fill={qColor}
              stroke="#ffffff"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            <path
              d="M 55 18 C 33 18 23 32 23 46 C 23 52 27 56 34 56 C 41 56 46 51 46 45 C 46 38 49 32 55 32 C 61 32 67 35 67 42 C 67 50 60 56 53 62 C 47 68 42 76 43 88 C 43 92 47 96 52 96 C 57 96 61 92 61 87 C 61 79 65 74 72 68 C 80 61 88 53 88 40 C 88 24 74 18 55 18 Z M 52 105 C 46.5 105 42 109.5 42 115 C 42 120.5 46.5 125 52 125 C 57.5 125 62 120.5 62 115 C 62 109.5 57.5 105 52 105 Z"
              fill={qColor}
              stroke={explainerTheme.ink}
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );
    }
    case 'retak':
      return (
        <svg width={width} height={width * 0.75} viewBox="0 0 240 180">
          <path
            d="M 20 155 L 72 118 L 96 126 L 138 78 L 172 86 L 220 24 M 138 78 L 112 36 M 72 118 L 44 74"
            fill="none"
            stroke={warna ?? '#120f0c'}
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={420}
            strokeDashoffset={420 * (1 - Math.min(1, Math.max(0, progress)))}
          />
        </svg>
      );
    case 'tetes-air':
      return (
        <svg width={width} height={width} viewBox="0 0 120 120">
          <path d="M 60 14 C 60 14 26 58 26 80 A 34 34 0 1 0 94 80 C 94 58 60 14 60 14 Z" fill="#29b6f6" stroke="#0288d1" strokeWidth="5" />
          <ellipse cx="48" cy="76" rx="7" ry="12" fill="rgba(255,255,255,0.55)" transform="rotate(-18 48 76)" />
        </svg>
      );
    case 'gelombang-air':
      return (
        <svg width={width} height={width * 0.35} viewBox="0 0 300 105">
          <path
            d="M 10 55 Q 45 20 80 55 T 150 55 T 220 55 T 290 55 L 290 95 L 10 95 Z"
            fill="rgba(41, 182, 246, 0.78)"
            stroke="#0277bd"
            strokeWidth="6"
          />
        </svg>
      );
  }
};

const StageItemView: React.FC<{
  item: StageItem;
  words: TimedWord[];
  duration: number;
}> = ({item, words, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const tf = hitungTransformItem(item, frame, fps, words, duration);
  if (!tf.visible) return null;

  const kind = item.kind ?? (item.simbol ? 'simbol' : item.teks ? 'teks' : 'prop');
  const width = item.width ?? (kind === 'simbol' ? 170 : 340);
  const origin = tf.originY === 'bottom' ? '50% 100%' : '50% 50%';
  const anchorTranslate = tf.originY === 'bottom' ? 'translate(-50%, -100%)' : 'translate(-50%, -50%)';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${tf.x}%`,
        top: `${tf.y}%`,
        zIndex: item.zIndex ?? 10,
        opacity: tf.opacity,
        transformOrigin: origin,
        transform: `${anchorTranslate} translate(${tf.tx + tf.shakeX}px, ${tf.ty}px) scale(${tf.scaleX}, ${tf.scaleY}) rotate(${tf.rotate}deg)`,
        pointerEvents: 'none',
      }}
    >
      {kind === 'prop' && item.src ? (
        <Img
          src={staticFile(item.src)}
          style={{
            width,
            display: 'block',
            borderRadius: item.bingkai ? 10 : 0,
            border: item.bingkai ? `6px solid ${explainerTheme.ink}` : undefined,
            filter: 'drop-shadow(0 16px 26px rgba(0,0,0,0.34))',
          }}
        />
      ) : null}
      {kind === 'teks' && item.teks ? (
        <div
          style={{
            fontFamily: explainerTheme.fontBody,
            fontWeight: 900,
            fontSize: item.ukuran ?? 56,
            color: item.warna ?? (item.kotak ? explainerTheme.bannerText : explainerTheme.ink),
            background: item.kotak,
            padding: item.kotak ? '10px 24px' : 0,
            borderRadius: item.kotak ? 8 : 0,
            whiteSpace: 'nowrap',
            letterSpacing: -0.5,
          }}
        >
          {parseWords(item.teks).map((w, idx) => (
            <span
              key={idx}
              style={{
                color: w.highlight ? explainerTheme.accent : undefined,
                marginRight: idx + 1 < parseWords(item.teks!).length ? '0.24em' : 0,
              }}
            >
              {w.word}
            </span>
          ))}
        </div>
      ) : null}
      {kind === 'simbol' && item.simbol ? (
        <SymbolSvg
          simbol={item.simbol}
          width={width}
          warna={item.warna}
          progress={(frame - waktuItem(item, words, duration).masukAt) / 14}
        />
      ) : null}
    </div>
  );
};

export const Stage: React.FC<{
  items?: StageItem[];
  words: TimedWord[];
  duration: number;
}> = ({items, words, duration}) => {
  if (!items?.length) return null;

  return (
    <>
      {items.map((item, i) => {
        const {masukAt, aksi} = waktuItem(item, words, duration);
        const isHeavy = item.simbol === 'larang' || item.simbol === 'retak';
        const defaultEnterSfx: ExplainerSfxName | null =
          item.masuk === 'none' || masukAt <= 2
            ? null
            : item.simbol === 'centang'
              ? 'ding'
              : item.simbol === 'silang'
                ? 'slap'
                : isHeavy
                ? 'dum'
                : 'pop';
        const enterSfx = item.sfx === false ? null : (item.sfx ?? defaultEnterSfx);

        return (
          <React.Fragment key={i}>
            {enterSfx ? <ExplainerSfx name={enterSfx} at={masukAt} /> : null}
            {aksi.map((a, k) => {
              const defaultActionSfx: ExplainerSfxName | null =
                a.type === 'peek' || a.type === 'jump'
                  ? 'boing'
                  : a.type === 'squash'
                    ? 'slap'
                    : a.type === 'shake'
                      ? 'dum'
                      : null;
              const actionSfx = a.sfx === false ? null : (a.sfx ?? defaultActionSfx);
              return actionSfx ? <ExplainerSfx key={`act-sfx-${k}`} name={actionSfx} at={a.at} /> : null;
            })}
            <StageItemView item={item} words={words} duration={duration} />
          </React.Fragment>
        );
      })}
    </>
  );
};
