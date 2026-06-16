'use client';

import React from 'react';
import { ACID, MONO, BODY, TIER_BADGE } from '../shared/tokens';
import { band } from '../shared/math';
import { BEATS } from '../shared/data';

/* ============================================================================
   CAPTION BAR — eyebrow pill + line per beat
   ============================================================================ */
const CaptionBar: React.FC<{
  p: number;
}> = ({
  p
}) => <div className="absolute bottom-7 left-1/2 z-10 w-full -translate-x-1/2 px-10">
    <div className="relative mx-auto h-12 max-w-[600px]">
      {BEATS.map(beat => {
      const vis = band(p, beat.a, beat.b, 0.03);
      if (vis <= 0.001) return null;
      return <div key={beat.eyebrow} className="absolute left-1/2 top-0 flex w-full -translate-x-1/2 flex-col items-center gap-1.5 text-center" style={{
        opacity: vis
      }}>
            <span className="inline-flex items-center border-2 border-black px-2.5 py-1" style={{
          background: ACID,
          boxShadow: `${TIER_BADGE.shadow}px ${TIER_BADGE.shadow}px 0 0 #000`,
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: TIER_BADGE.font,
          letterSpacing: '0.08em',
          color: '#000'
        }}>{beat.eyebrow}</span>
            <span className="text-small" style={{
          fontFamily: BODY,
          fontWeight: 400,
          color: '#1f2937'
        }}>{beat.line}</span>
          </div>;
    })}
    </div>
  </div>;

export { CaptionBar };
