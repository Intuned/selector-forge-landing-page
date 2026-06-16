'use client';

import React from 'react';
import { ACID, MONO, TIER_CONTROL } from '../shared/tokens';
import { seg } from '../shared/math';
import { LIST_A } from '../shared/constants';

/* ============================================================================
   SEGMENTED CONTROL — ELEMENT · LIST, indicator slides at the toggle
   ============================================================================ */
const SegmentedControl: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const slide = seg(p, LIST_A - 0.05, LIST_A + 0.01);
  const elementActive = slide < 0.5;
  return <div className="flex justify-center">
      <div className="relative inline-flex border-2 border-black bg-white p-1" style={{
      boxShadow: `${TIER_CONTROL.shadow}px ${TIER_CONTROL.shadow}px 0 0 #000`,
      borderRadius: 0
    }}>
        <div aria-hidden className="absolute top-1 bottom-1 left-1" style={{
        width: 'calc(50% - 4px)',
        transform: `translateX(${slide * 100}%)`,
        background: ACID,
        border: '2px solid #000',
        willChange: 'transform',
        borderRadius: 0
      }} />
        <SegLabel active={elementActive}>ELEMENT</SegLabel>
        <SegLabel active={!elementActive}>LIST</SegLabel>
      </div>
    </div>;
};
const SegLabel: React.FC<{
  active: boolean;
  children: React.ReactNode;
}> = ({
  active,
  children
}) => <span className="relative z-10 flex w-[84px] items-center justify-center py-1.5 transition-colors duration-200" style={{
  fontFamily: MONO,
  fontWeight: 700,
  fontSize: `${TIER_CONTROL.font}px`,
  letterSpacing: '0.08em',
  color: active ? '#000' : '#9ca3af'
}}>
    {children}
  </span>;

export { SegmentedControl };
