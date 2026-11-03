import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {CHANNEL} from './channel';
import {FilmOverlay} from './components/FilmOverlay';
import {Watermark} from './components/Watermark';
import {dorong, kartu, whip, zoom} from './components/transitions';
import {TRANSITION_FRAMES, transitionFrames} from './lib/kata';
import {applyNarasi, NARASI_DELAY, narasiFile} from './lib/narasi';
import {ChapterScene} from './scenes/ChapterScene';
import {FactScene} from './scenes/FactScene';
import {KutipanScene} from './scenes/KutipanScene';
import {OutroScene} from './scenes/OutroScene';
import {PhotoScene} from './scenes/PhotoScene';
import {TimelineScene} from './scenes/TimelineScene';
import {TitleScene} from './scenes/TitleScene';
import {theme} from './theme';
import type {Scene, TransitionType, VideoScript} from './types';

// Total durasi = jumlah semua scene dikurangi bagian yang tumpang tindih saat transisi.
export const getTotalDuration = (script: VideoScript) =>
  script.scenes.reduce(
    (total, scene, i) => total + scene.duration - (i === 0 ? 0 : transitionFrames(scene.transition)),
    0,
  );

// Dipakai calculateMetadata di Root.tsx: durasi scene & timing kata mengikuti audio narasi (kalau ada).
export const prepareScript = (script: VideoScript, fps: number) =>
  applyNarasi(script, fps, (i) =>
    i < script.scenes.length ? transitionFrames(script.scenes[i].transition) : 0,
  );

const renderScene = (scene: Scene) => {
  switch (scene.type) {
    case 'title':
      return <TitleScene scene={scene} />;
    case 'photo':
      return <PhotoScene scene={scene} />;
    case 'fact':
      return <FactScene scene={scene} />;
    case 'outro':
      return <OutroScene scene={scene} />;
    case 'chapter':
      return <ChapterScene scene={scene} />;
    case 'timeline':
      return <TimelineScene scene={scene} />;
    case 'kutipan':
      return <KutipanScene scene={scene} />;
  }
};

const renderTransition = (type: TransitionType = 'dorong', key: string) => {
  switch (type) {
    case 'none':
      return null;
    case 'dorong':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={dorong()}
          timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION_FRAMES})}
        />
      );
    case 'kartu':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={kartu()}
          timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION_FRAMES})}
        />
      );
    case 'whip':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={whip()}
          timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION_FRAMES})}
        />
      );
    case 'zoom':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={zoom()}
          timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION_FRAMES})}
        />
      );
    case 'slide':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={slide({direction: 'from-right'})}
          timing={springTiming({config: {damping: 200}, durationInFrames: TRANSITION_FRAMES})}
        />
      );
    case 'wipe':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={wipe({direction: 'from-left'})}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
      );
    case 'fade':
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={fade()}
          timing={linearTiming({durationInFrames: TRANSITION_FRAMES})}
        />
      );
  }
};

export const HistoryVideo: React.FC<{script: VideoScript}> = ({script}) => {
  const children = script.scenes.flatMap((scene, i) => {
    const narasi = narasiFile(script, i);
    return [
      i === 0 ? null : renderTransition(scene.transition, `t-${i}`),
      <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={scene.duration}>
        {renderScene(scene)}
        {narasi ? (
          <Sequence from={NARASI_DELAY} layout="none">
            <Audio src={staticFile(narasi)} />
          </Sequence>
        ) : null}
      </TransitionSeries.Sequence>,
    ];
  });

  return (
    <AbsoluteFill style={{backgroundColor: theme.bg}}>
      <TransitionSeries>{children.filter(Boolean)}</TransitionSeries>
      <FilmOverlay />
      {script.watermark === false ? null : <Watermark text={script.watermark ?? CHANNEL.nama} />}
      {script.music ? (
        <Audio
          src={staticFile(script.music)}
          volume={script.musicVolume ?? (script.narasiAudio || script.voiceover ? 0.12 : 0.25)}
        />
      ) : null}
      {script.voiceover ? <Audio src={staticFile(script.voiceover)} /> : null}
    </AbsoluteFill>
  );
};
