import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Sfx} from '../../components/Sfx';
import {frameOfWord, type TimedWord} from '../../lib/kata';
import {hitungBebanBata, hitungPotongan} from '../diagram';
import {Stage} from '../Stage';
import {explainerTheme} from '../theme';
import type {DiagramBataScene, DiagramPotonganScene, DiagramScene} from '../types';

export {hitungBebanBata, hitungPotongan};

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const PotonganView: React.FC<{
  scene: DiagramPotonganScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = hitungPotongan(scene.awal.nilai, scene.langkah, words);
  const lastStepAt = steps.length ? steps[steps.length - 1].at : 20;
  const pembagiAt =
    (scene.pembagi?.di ? frameOfWord(words, scene.pembagi.di) : null) ?? lastStepAt + 22;
  const hasilAt =
    (scene.hasil.di ? frameOfWord(words, scene.hasil.di) : null) ?? pembagiAt + 24;

  const awalIn = spring({frame, fps, config: {damping: 14, mass: 0.7}});
  const activeSteps = steps.filter((s) => frame >= s.at);
  const currentSisa = activeSteps.length ? activeSteps[activeSteps.length - 1].sisa : scene.awal.nilai;
  const currentPorsi = activeSteps.length ? activeSteps[activeSteps.length - 1].porsi : 1;

  const hasilSpring = spring({frame: frame - hasilAt, fps, config: {damping: 12, mass: 0.7}});

  return (
    <AbsoluteFill>
      {steps.map((s, i) => (
        <Sfx key={`sfx-step-${i}`} name="pop" at={s.at} />
      ))}
      {scene.pembagi ? <Sfx name="pop" at={pembagiAt} /> : null}
      <Sfx name="tik" at={hasilAt} />

      <div
        style={{
          position: 'absolute',
          top: '16%',
          left: 80,
          right: 80,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
          zIndex: 20,
        }}
      >
        {scene.judul ? (
          <div
            style={{
              background: explainerTheme.bannerBg,
              color: explainerTheme.bannerText,
              padding: '10px 26px',
              fontFamily: explainerTheme.fontBody,
              fontWeight: 900,
              fontSize: 44,
              textTransform: 'uppercase',
            }}
          >
            {scene.judul}
          </div>
        ) : null}

        {/* Bar nilai awal & sisa */}
        <div
          style={{
            width: '100%',
            background: explainerTheme.cardBg,
            border: `5px solid ${explainerTheme.ink}`,
            borderRadius: 14,
            padding: 22,
            transform: `scale(${0.9 + 0.1 * awalIn})`,
            opacity: Math.min(1, awalIn * 2),
            boxShadow: '0 10px 0 rgba(29,24,18,0.14)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontFamily: explainerTheme.fontBody,
              color: explainerTheme.ink,
              marginBottom: 12,
            }}
          >
            <span style={{fontSize: 30, fontWeight: 700}}>{scene.awal.label}</span>
            <span style={{fontSize: 48, fontWeight: 900}}>{currentSisa}</span>
          </div>
          <div
            style={{
              width: '100%',
              height: 34,
              background: 'rgba(29,24,18,0.12)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${currentPorsi * 100}%`,
                height: '100%',
                background: explainerTheme.green,
                borderRadius: 8,
              }}
            />
          </div>
        </div>

        {/* Langkah potongan */}
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', gap: 12}}>
          {steps.map((step, i) => {
            if (frame < step.at) return null;
            const s = spring({frame: frame - step.at, fps, config: {damping: 14, mass: 0.6}});
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f7f2e2',
                  border: `4px solid ${explainerTheme.ink}`,
                  borderRadius: 12,
                  padding: '14px 22px',
                  transform: `translateX(${(1 - s) * 80}px) scale(${0.92 + 0.08 * s})`,
                  opacity: Math.min(1, s * 2),
                  fontFamily: explainerTheme.fontBody,
                }}
              >
                <span style={{fontSize: 30, fontWeight: 700, color: explainerTheme.ink}}>
                  {step.label}
                </span>
                <span
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    color: step.warna ?? explainerTheme.red,
                  }}
                >
                  {step.potong}
                </span>
              </div>
            );
          })}
        </div>

        {/* Pembagi */}
        {scene.pembagi && frame >= pembagiAt ? (
          <div
            style={{
              background: explainerTheme.bannerBg,
              color: explainerTheme.bannerText,
              padding: '10px 26px',
              borderRadius: 10,
              fontFamily: explainerTheme.fontMono,
              fontWeight: 700,
              fontSize: 30,
            }}
          >
            {scene.pembagi.label}: {scene.pembagi.nilai}
          </div>
        ) : null}

        {/* Hasil akhir */}
        {frame >= hasilAt ? (
          <div
            style={{
              marginTop: 6,
              background: explainerTheme.green,
              color: '#ffffff',
              border: `6px solid ${explainerTheme.ink}`,
              borderRadius: 16,
              padding: '18px 38px',
              textAlign: 'center',
              transform: `scale(${hasilSpring})`,
              boxShadow: '0 12px 0 rgba(29,24,18,0.2)',
              fontFamily: explainerTheme.fontBody,
            }}
          >
            <div style={{fontSize: 26, fontWeight: 700, opacity: 0.92, textTransform: 'uppercase'}}>
              {scene.hasil.label}
            </div>
            <div style={{fontSize: 64, fontWeight: 900, lineHeight: 1.1}}>
              {scene.hasil.nilai.replace(/\*/g, '')}
            </div>
          </div>
        ) : null}
      </div>

      <Stage items={scene.items} words={words} duration={scene.duration} />
    </AbsoluteFill>
  );
};

const GridBataView: React.FC<{
  scene: DiagramBataScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const baris = scene.baris ?? 5;
  const kolom = scene.kolom ?? 5;
  const nilaiBeban = scene.beban?.nilai ?? 100;
  const satuan = scene.beban?.satuan ?? 'kg';
  const grid = hitungBebanBata(scene.pola, baris, kolom, nilaiBeban);

  const rakitAt = scene.rakitDi ? (frameOfWord(words, scene.rakitDi) ?? 0) : 0;
  const bebanAt = scene.beban?.di ? (frameOfWord(words, scene.beban.di) ?? 18) : Infinity;
  const angkaAt = scene.beban?.angkaDi
    ? (frameOfWord(words, scene.beban.angkaDi) ?? bebanAt + 12)
    : bebanAt + 12;

  const wallWidth = scene.width ?? 680;
  const brickW = wallWidth / Math.max(1, kolom + 0.5);
  const brickH = Math.round(brickW * 0.44);
  const gap = 6;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: `${scene.x ?? 50}%`,
          top: `${scene.y ?? 48}%`,
          transform: 'translate(-50%, -50%)',
          zIndex: 15,
        }}
      >
        {grid.map((row, r) => (
          <div
            key={r}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: gap,
              transform:
                scene.pola === 'zigzag' && r % 2 === 1 ? `translateX(${brickW * 0.25}px)` : undefined,
            }}
          >
            {row.map((b, c) => {
              const orderFromBottom = (baris - 1 - r) * kolom + c;
              const dropStart = scene.rakitDi ? rakitAt + orderFromBottom * 2 : 0;
              const enter = spring({
                frame: frame - dropStart,
                fps,
                config: {damping: 14, mass: 0.6},
              });
              const dimProgress =
                frame >= bebanAt && !b.aktif
                  ? interpolate(frame - bebanAt, [0, 12], [1, 0.24], clamp)
                  : 1;
              const showLabel = frame >= angkaAt + r * 4 && b.aktif;

              return (
                <div
                  key={c}
                  style={{
                    width: brickW - gap,
                    height: brickH,
                    marginRight: gap,
                    background: '#a64432',
                    border: '3px solid #5c2217',
                    borderRadius: 4,
                    opacity: Math.min(1, enter * 2) * dimProgress,
                    transform: `translateY(${(1 - enter) * -60}px)`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontFamily: explainerTheme.fontMono,
                    fontWeight: 700,
                    fontSize: Math.max(16, Math.round(brickH * 0.42)),
                    color: '#ffffff',
                  }}
                >
                  {showLabel ? (
                    <span
                      style={{
                        background: 'rgba(13,13,13,0.78)',
                        padding: '2px 8px',
                        borderRadius: 4,
                      }}
                    >
                      {b.beban}
                      {satuan}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <Stage items={scene.items} words={words} duration={scene.duration} />
    </AbsoluteFill>
  );
};

export const DiagramSceneView: React.FC<{
  scene: DiagramScene;
  words: TimedWord[];
}> = ({scene, words}) => {
  if (scene.mode === 'potongan') {
    return <PotonganView scene={scene} words={words} />;
  }
  return <GridBataView scene={scene} words={words} />;
};
