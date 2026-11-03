import React from 'react';
import {Composition} from 'remotion';
import {daftarVideo} from './data/daftar';
import {getTotalDuration, HistoryVideo, prepareScript} from './HistoryVideo';
import {FORMAT_SIZE} from './lib/layout';

const FPS = 30;

// Satu <Composition> per video di src/data/daftar.ts. Ukuran mengikuti `format` naskah (landscape/short).
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
    </>
  );
};
