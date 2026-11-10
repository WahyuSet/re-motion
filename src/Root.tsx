import React from 'react';
import {Composition, Still} from 'remotion';
import {daftarVideo} from './data/daftar';
import {daftarExplainer} from './explainer/daftar';
import {ExplainerThumb} from './explainer/ExplainerThumb';
import {ExplainerVideo, getExplainerDuration, prepareExplainerScript} from './explainer/ExplainerVideo';
import {getTotalDuration, HistoryVideo, prepareScript} from './HistoryVideo';
import {FORMAT_SIZE, THUMB_SIZE} from './lib/layout';
import {Thumbnail} from './Thumbnail';

const FPS = 30;

// Satu <Composition> per video di src/data/daftar.ts. Ukuran mengikuti `format` naskah (landscape/short).
// Video yang punya `thumbnail` juga mendapat <Still id="<Id>Thumb"> (dirender scripts/paket-youtube.mjs).
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {daftarVideo.map(({id, script}) => (
        <Composition
          key={id}
          id={id}
          component={HistoryVideo}
          {...FORMAT_SIZE[script.format ?? 'landscape']}
          fps={FPS}
          durationInFrames={300}
          defaultProps={{script}}
          calculateMetadata={async ({props}) => {
            const prepared = await prepareScript(props.script, FPS);
            const grain = (props as {grain?: number}).grain ?? prepared.grain;
            return {
              ...FORMAT_SIZE[prepared.format ?? 'landscape'],
              durationInFrames: getTotalDuration(prepared),
              props: {script: grain === undefined ? prepared : {...prepared, grain}},
            };
          }}
        />
      ))}
      {daftarVideo
        .filter(({script}) => script.thumbnail)
        .map(({id, script}) => (
          <Still
            key={`${id}Thumb`}
            id={`${id}Thumb`}
            component={Thumbnail}
            {...THUMB_SIZE[script.format ?? 'landscape']}
            defaultProps={{script}}
          />
        ))}
      {daftarExplainer.map(({id, script}) => (
        <Composition
          key={id}
          id={id}
          component={ExplainerVideo}
          {...FORMAT_SIZE[script.format ?? 'short']}
          fps={FPS}
          durationInFrames={300}
          defaultProps={{script}}
          calculateMetadata={async ({props}) => {
            const prepared = await prepareExplainerScript(props.script, FPS);
            return {
              ...FORMAT_SIZE[prepared.format ?? 'short'],
              durationInFrames: getExplainerDuration(prepared),
              props: {script: prepared},
            };
          }}
        />
      ))}
      {daftarExplainer
        .filter(({script}) => script.thumbnail)
        .map(({id, script}) => (
          <Still
            key={`${id}Thumb`}
            id={`${id}Thumb`}
            component={ExplainerThumb}
            {...THUMB_SIZE[script.format ?? 'short']}
            defaultProps={{script}}
          />
        ))}
    </>
  );
};
