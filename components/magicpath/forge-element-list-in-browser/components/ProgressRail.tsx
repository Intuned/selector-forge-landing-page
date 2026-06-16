'use client';

import React from 'react';
import { ACID, MONO } from '../shared/tokens';
import { TICKS } from '../shared/data';

/* ============================================================================
   PROGRESS RAIL — right edge, acid fill by P
   ============================================================================ */
const ProgressRail: React.FC<{
  p: number;
}> = ({
  p
}) => <div className="absolute right-4 top-1/2 z-30 flex h-[62%] -translate-y-1/2 flex-col items-center">
    <div className="relative h-full w-[2px] bg-black">
      <div className="absolute left-0 top-0 w-full" style={{
      height: `${p * 100}%`,
      background: ACID,
      willChange: 'height'
    }} />
      {TICKS.map(t => {
      const passed = p >= t.p - 0.001;
      return <div key={t.label} className="absolute right-[6px] flex items-center" style={{
        top: `${t.p * 100}%`,
        transform: 'translateY(-50%)'
      }}>
            <span className="text-nano" style={{
          fontFamily: MONO,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: passed ? '#000' : '#bdbdbd',
          background: passed ? ACID : 'transparent',
          padding: passed ? '1px 3px' : '1px 0',
          whiteSpace: 'nowrap',
          transition: 'color 0.2s, background 0.2s',
          marginRight: '4px'
        }}>{t.label}</span>
            <span className="block h-[2px] w-[6px]" style={{
          background: '#000'
        }} />
          </div>;
    })}
    </div>
  </div>;

export { ProgressRail };
