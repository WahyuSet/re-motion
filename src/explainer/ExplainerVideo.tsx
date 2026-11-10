import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {wipe} from '@remotion/transitions/wipe';
import {CHANNEL} from '../channel';
import {Sfx, SfxContext} from '../components/Sfx';
import {dorong, kartu, whip, zoom} from '../components/transitions';
import {rentangSuara, sceneWords, TRANSITION_FRAMES, volumeMusik} from '../lib/kata';
import {NARASI_DELAY, narasiFile} from '../lib/narasi';
import type {Scene as HistoryScene, TransitionType, VideoScript} from '../types';
import {explainerTransitionFrames, getExplainerDuration, prepareExplainerScript} from './prep';
import {BeatSceneView} from './scenes/BeatScene';
import {DiagramSceneView} from './scenes/DiagramScene';
import {HookSceneView} from './scenes/HookScene';
import {StageSceneView} from './scenes/StageScene';
import {ExplainerSubtitle} from './Subtitle';
import {explainerTheme} from './theme';
import type {ExplainerScene, ExplainerScript} from './types';

export {explainerTransitionFrames, getExplainerDuration, prepareExplainerScript};

const FullSceneBackdrop: React.FC<{scene: ExplainerScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  if (!scene.latar) return null;
  const p = Math.min(1, Math.max(0, frame / Math.max(1, scene.duration)));
  const scale = 1.02 + p * 0.08;

  return (
    <AbsoluteFill style={{zIndex: 0, overflow: 'hidden', pointerEvents: 'none'}}>
      <Img
        src={staticFile(scene.latar)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 1,
          transform: `scale(${scale})`,
        }}
      />
    </AbsoluteFill>
  );
};

const renderExplainerScene = (scene: ExplainerScene, fps: number) => {
  const words = sceneWords(scene, fps);
  return (
    <AbsoluteFill>
      <FullSceneBackdrop scene={scene} />
      {scene.type === 'hook' ? <HookSceneView scene={scene} words={words} /> : null}
      {scene.type === 'beat' ? <BeatSceneView scene={scene} words={words} /> : null}
      {scene.type === 'stage' ? <StageSceneView scene={scene} words={words} /> : null}
      {scene.type === 'diagram' ? <DiagramSceneView scene={scene} words={words} /> : null}
      <ExplainerSubtitle words={words} accentColor={scene.accentColor} overPhoto={Boolean(scene.latar)} />
    </AbsoluteFill>
  );
};

const renderTransition = (type: TransitionType = 'none', key: string) => {
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

export const ExplainerVideo: React.FC<{script: ExplainerScript}> = ({script}) => {
  const {fps, durationInFrames} = useVideoConfig();
  const suara = rentangSuara(script.scenes as unknown as HistoryScene[], fps);
  const watermarkText =
    typeof script.watermark === 'string' && script.watermark.trim() ? script.watermark : null;

  const children = script.scenes.flatMap((scene, i) => {
    const narasi = narasiFile(script as unknown as VideoScript, i);
    const trans = scene.transition ?? 'none';
    return [
      i === 0 ? null : renderTransition(trans, `t-${i}`),
      <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={scene.duration}>
        {renderExplainerScene(scene, fps)}
        {i > 0 && trans !== 'none' ? <Sfx name="whoosh" at={0} /> : null}
        {narasi ? (
          <Sequence from={NARASI_DELAY} layout="none">
            <Audio src={staticFile(narasi)} />
          </Sequence>
        ) : null}
      </TransitionSeries.Sequence>,
    ];
  });

  return (
    <SfxContext.Provider value={script.sfx !== false}>
      <AbsoluteFill style={{backgroundColor: script.bg ?? explainerTheme.bg}}>
        {watermarkText ? (
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
              zIndex: 1,
              pointerEvents: 'none',
            }}
          >
            {watermarkText}
          </div>
        ) : null}
        <TransitionSeries>{children.filter(Boolean)}</TransitionSeries>
        {script.music ? (
          <Audio
            src={staticFile(script.music)}
            loop
            volume={(f) =>
              volumeMusik(f, durationInFrames, fps, suara, script.musicVolume, Boolean(script.voiceover))
            }
          />
        ) : null}
        {script.voiceover ? <Audio src={staticFile(script.voiceover)} /> : null}
      </AbsoluteFill>
    </SfxContext.Provider>
  );
};
