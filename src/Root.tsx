import React from 'react';
import {Composition} from 'remotion';
import {daftarVideo} from './data/daftar';
import {getTotalDuration, HistoryVideo, prepareScript} from './HistoryVideo';

const FPS = 30;

// Satu <Composition> per video di src/data/daftar.ts.
export const RemotionRoot: React.FC = () => {
  return (
    <>
      {daftarVideo.map(({id, script}) => (
        <Composition
          key={id}
          id={id}
          component={HistoryVideo}
          width={1920}
          height={1080}
          fps={FPS}
          durationInFrames={300}
          defaultProps={{script}}
          calculateMetadata={async ({props}) => {
            const prepared = await prepareScript(props.script, FPS);
            return {durationInFrames: getTotalDuration(prepared), props: {script: prepared}};
          }}
        />
      ))}
    </>
  );
};
