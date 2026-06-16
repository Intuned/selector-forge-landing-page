'use client';

import React from 'react';
import { ACID, INK, MONO } from '../../shared/tokens';
import { band } from '../../shared/math';
import { W_PICK, W_TARGET } from '../../shared/constants';

/* ============================================================================
   INSPECT HIGHLIGHT — devtools-style dashed outline + tag over the value the
   user is hovering, BEFORE the click locks it. Drawn at window level (uses the
   measured target rect), so it reads as "the user is selecting this element."
   ============================================================================ */
const InspectHighlight: React.FC<{
  p: number;
  target: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}> = ({
  p,
  target
}) => {
  const vis = band(p, W_PICK + 0.02, W_TARGET + 0.005, 0.012);
  if (vis <= 0.001 || target.w <= 0) return null;
  const pad = 4;
  const left = target.x - pad,
    top = target.y - pad,
    w = target.w + pad * 2,
    h = target.h + pad * 2;
  const tick: React.CSSProperties = {
    position: 'absolute',
    width: 7,
    height: 7,
    border: `2px solid ${INK}`,
    background: ACID
  };
  return <div aria-hidden className="pointer-events-none absolute" style={{
    left,
    top,
    width: w,
    height: h,
    zIndex: 20,
    opacity: vis
  }}>
      <span style={{
      position: 'absolute',
      inset: 0,
      border: `2px dashed ${INK}`
    }} />
      <span style={{
      ...tick,
      left: -4,
      top: -4
    }} />
      <span style={{
      ...tick,
      right: -4,
      top: -4
    }} />
      <span style={{
      ...tick,
      left: -4,
      bottom: -4
    }} />
      <span style={{
      ...tick,
      right: -4,
      bottom: -4
    }} />
      {/* devtools-style tag above the box */}
      <span style={{
      position: 'absolute',
      left: -2,
      top: -24,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: INK,
      padding: '2px 7px',
      whiteSpace: 'nowrap',
      boxShadow: `2px 2px 0 0 ${ACID}`
    }}>
        <span className="text-micro" style={{
        fontFamily: MONO,
        fontWeight: 700,
        color: ACID
      }}>dd</span>
        <span className="text-micro" style={{
        fontFamily: MONO,
        fontWeight: 400,
        color: '#fff'
      }}>Solicitation Type</span>
      </span>
    </div>;
};

export { InspectHighlight };
