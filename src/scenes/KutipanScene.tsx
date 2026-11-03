import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {SceneLayers} from '../components/Layout';
import {Props} from '../components/Prop';
import {ShotStack, shotsOf} from '../components/ShotStack';
import {Subtitle} from '../components/Subtitle';
import {indexOfWord, parseWords, sceneWords, type TimedWord} from '../lib/kata';
import {useLayout} from '../lib/layout';
import {theme} from '../theme';
import type {KutipanScene as KutipanSceneData} from '../types';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/**
 * Frame tiap kata kutipan menyala. Kalau kutipan dibacakan di narasi (kata pertamanya ada di narasi
 * dan sisanya muat), ikut waktu kata narasi itu; kalau tidak, dibagi rata sepanjang narasi.
 */
const waktuKutipan = (teks: string[], words: TimedWord[], duration: number) => {
  const mulai = indexOfWord(words, teks[0] ?? '');
  if (mulai >= 0 && mulai + teks.length <= words.length) return teks.map((_, k) => words[mulai + k].start);
  const awal = words[0]?.start ?? 10;
  const akhir = words.length ? words[words.length - 1].end : duration * 0.7;
  return teks.map((_, k) => Math.round(awal + ((akhir - awal) * k) / Math.max(1, teks.length)));
};

// Kutipan: tanda kutip besar, teks Playfair miring yang menyala kata demi kata mengikuti narasi,
// sumber mono di bawah, foto berbingkai di sisi (short: di atas). Latar foto yang sama, buram & gelap.
export const KutipanScene: React.FC<{scene: KutipanSceneData}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = useLayout();
  const K = L.kutipan;
  const words = sceneWords(scene, fps);
  const teks = parseWords(scene.teks.trim());
  const waktu = waktuKutipan(teks.map((w) => w.word), words, scene.duration);

  const mark = spring({frame: frame - 2, fps, config: {damping: 14}});
  const foto = spring({frame: frame - 4, fps, config: {damping: 16, mass: 0.7}});
  const sumber = interpolate(frame, [14, 28], [0, 1], clamp);
  const shots = shotsOf(scene);

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      {/* Latar: tag & kredit shot tampil dari sini, di posisi biasanya */}
      <ShotStack shots={shots} duration={scene.duration} words={words} dim={0.68} blur={24} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(14,11,8,0.7) 0%, rgba(14,11,8,0.25) 100%)'}} />

      {shots.length ? (
        <div
          style={{
            position: 'absolute',
            left: K.foto.left,
            top: K.foto.top,
            width: K.foto.width,
            height: K.foto.height,
            padding: 16,
            paddingBottom: 24,
            background: '#efe6d2',
            boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 8px 20px rgba(0,0,0,0.4)',
            opacity: Math.min(1, foto * 2),
            transform: `translateY(${(1 - foto) * 80}px) rotate(${K.foto.rotate + (1 - foto) * 5}deg)`,
          }}
        >
          <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden'}}>
            <ShotStack shots={shots} duration={scene.duration} words={words} hanyaFoto />
          </div>
        </div>
      ) : null}

      <div style={{position: 'absolute', left: K.teksLeft, top: K.teksTop, width: K.teksWidth}}>
        <div
          style={{
            position: 'absolute',
            left: -K.markSize * 0.08,
            top: -K.markSize * 0.5,
            fontFamily: theme.fontTitle,
            fontWeight: 900,
            fontSize: K.markSize,
            lineHeight: 1,
            color: theme.gold,
            opacity: 0.85 * mark,
            transform: `scale(${0.6 + 0.4 * mark})`,
            transformOrigin: 'left top',
          }}
        >
          “
        </div>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '0.26em',
            fontFamily: theme.fontTitle,
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: K.teksSize,
            lineHeight: 1.28,
            paddingTop: K.markSize * 0.3,
          }}
        >
          {teks.map(({word, highlight}, k) => {
            const nyala = interpolate(frame - waktu[k], [-2, 6], [0, 1], clamp);
            return (
              <span
                key={k}
                style={{
                  display: 'inline-block',
                  color: highlight ? theme.gold : theme.paper,
                  opacity: 0.16 + 0.84 * nyala,
                  transform: `translateY(${(1 - nyala) * 8}px)`,
                  textShadow: '0 4px 20px rgba(0,0,0,0.7)',
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
        <div
          style={{
            marginTop: 30,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            opacity: sumber,
            transform: `translateX(${(1 - sumber) * -20}px)`,
          }}
        >
          <div style={{width: 60, height: 3, background: theme.gold}} />
          <div
            style={{
              fontFamily: theme.fontMono,
              fontWeight: 600,
              fontSize: K.sumberSize,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: theme.gold,
            }}
          >
            {scene.sumber}
          </div>
        </div>
      </div>

      <Props items={scene.props} words={words} />
      <SceneLayers scene={scene} words={words} />
      <Subtitle words={words} />
    </AbsoluteFill>
  );
};
