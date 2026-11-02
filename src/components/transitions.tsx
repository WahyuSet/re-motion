import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';

type NoProps = Record<string, never>;

// Whip pan: kamera seperti dikibas ke samping, kedua gambar kabur saat bergerak.
const Whip: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === 'entering';
  const x = entering ? (1 - p) * 100 : -p * 100;
  const blur = (entering ? 1 - p : p) * 40;
  return <AbsoluteFill style={{transform: `translateX(${x}%)`, filter: `blur(${blur}px)`}}>{children}</AbsoluteFill>;
};

// Zoom through: gambar lama membesar & memudar, gambar baru datang dari dekat lalu tajam.
const Zoom: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  const entering = presentationDirection === 'entering';
  const scale = entering ? 1 + (1 - p) * 0.35 : 1 + p * 0.6;
  const blur = (entering ? 1 - p : p) * 16;
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity: entering ? p : 1 - p * 0.5}}>
      {children}
    </AbsoluteFill>
  );
};

export const whip = (): TransitionPresentation<NoProps> => ({component: Whip, props: {}});
export const zoom = (): TransitionPresentation<NoProps> => ({component: Zoom, props: {}});

// Dorong: scene baru masuk dari kanan dan mendorong scene lama, yang bergeser lebih lambat
// (paralaks) dan meredup. Tanpa blur, jadi tidak terasa seperti preset editor.
const Dorong: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === 'entering') {
    return (
      <AbsoluteFill style={{transform: `translateX(${(1 - p) * 100}%)`, boxShadow: '-40px 0 80px rgba(0,0,0,0.6)'}}>
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{transform: `translateX(${-p * 35}%)`, filter: `brightness(${1 - p * 0.6})`}}>{children}</AbsoluteFill>
  );
};

// Kartu: scene baru datang dari kedalaman (kecil, sedikit miring, berbayang) lalu memenuhi layar,
// scene lama menggelap (sedikit membesar, supaya tepi panggung tidak pernah terlihat).
const Kartu: React.FC<TransitionPresentationComponentProps<NoProps>> = ({
  children,
  presentationDirection,
  presentationProgress: p,
}) => {
  if (presentationDirection === 'entering') {
    return (
      <AbsoluteFill
        style={{
          transform: `translateY(${(1 - p) * 12}%) scale(${0.78 + 0.22 * p}) rotate(${(1 - p) * -4}deg)`,
          boxShadow: `0 40px 120px rgba(0,0,0,${0.7 * (1 - p)})`,
          opacity: Math.min(1, p * 3),
        }}
      >
        {children}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{transform: `scale(${1 + p * 0.06})`, filter: `brightness(${1 - p * 0.7})`}}>{children}</AbsoluteFill>
  );
};

export const dorong = (): TransitionPresentation<NoProps> => ({component: Dorong, props: {}});
export const kartu = (): TransitionPresentation<NoProps> => ({component: Kartu, props: {}});
