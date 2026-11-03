import React from 'react';
import {Composition, Still} from 'remotion';
import {daftarVideo} from './data/daftar';
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
            return {
              ...FORMAT_SIZE[prepared.format ?? 'landscape'],
              durationInFrames: getTotalDuration(prepared),
              props: {script: prepared},
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
    </>
  );
};
