'use client';

import React from 'react';
import { ACID, INK, MONO } from '../../shared/tokens';
import { lerp, lerpPt, seg, segLin, band } from '../../shared/math';
import { W_ICON, W_PICK, W_TARGET } from '../../shared/constants';
import type { CG } from '../../shared/types';

/* ============================================================================
   PICKER CURSOR — a single visible cursor that drives the intro:
     rest → extension icon (CLICK, popup drops) → "Pick element" (CLICK) →
     morph to crosshair → target value (CLICK, anchors). Click ripples + a
     "click to anchor" hint make each action legible.
   ============================================================================ */
const Ripple: React.FC<{
  p: number;
  at: {
    x: number;
    y: number;
  };
  t0: number;
}> = ({
  p,
  at,
  t0
}) => {
  const prog = segLin(p, t0, t0 + 0.02);
  if (prog <= 0.001 || prog >= 1) return null;
  const size = lerp(10, 34, prog);
  return <span aria-hidden className="pointer-events-none absolute" style={{
    left: at.x,
    top: at.y,
    width: size,
    height: size,
    transform: 'translate(-50%, -50%)',
    borderRadius: 999,
    border: `2px solid ${INK}`,
    opacity: 1 - prog,
    zIndex: 41
  }} />;
};
const PickerCursor: React.FC<{
  p: number;
  cg: CG;
}> = ({
  p,
  cg
}) => {
  const op = band(p, 0.02, 0.4, 0.02);
  if (op <= 0.001 || !cg.icon.x || !cg.pick.x || !cg.target.w) return null;
  const rest = {
    x: cg.target.x + 70,
    y: cg.target.y + cg.target.h + 150
  };
  const icon = cg.icon;
  const pick = cg.pick;
  const target = {
    x: cg.target.x + Math.min(cg.target.w * 0.5, 60),
    y: cg.target.y + cg.target.h / 2
  };
  let pos: {
    x: number;
    y: number;
  };
  if (p < 0.085) pos = lerpPt(rest, icon, seg(p, 0.04, 0.085));else if (p < 0.14) pos = icon; // click icon + popup drops
  else if (p < 0.19) pos = lerpPt(icon, pick, seg(p, 0.14, 0.19));else if (p < W_PICK + 0.01) pos = pick; // click "Pick element"
  else if (p < 0.27) pos = lerpPt(pick, target, seg(p, W_PICK + 0.01, 0.27));else pos = target;
  const arrowOp = 1 - seg(p, W_PICK + 0.01, 0.235);
  const crossOp = seg(p, W_PICK + 0.01, 0.235);
  const hint = band(p, 0.235, W_TARGET, 0.012);
  return <div className="pointer-events-none absolute inset-0" style={{
    zIndex: 40,
    opacity: op
  }}>
      {/* arrow pointer (clicking UI) */}
      <span style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      transform: 'translate(-2px, -2px)',
      opacity: arrowOp,
      filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.25))'
    }}>
        <svg width="22" height="26" viewBox="0 0 22 26">
          <path d="M2 2 L2 19 L7 14 L10.5 22.5 L13.8 21 L10.3 12.8 L17.5 12.8 Z" fill="#fff" stroke={INK} strokeWidth={1.7} strokeLinejoin="round" />
        </svg>
      </span>

      {/* crosshair picker (selecting the page element) */}
      <span aria-hidden style={{
      position: 'absolute',
      left: pos.x,
      top: pos.y,
      width: 26,
      height: 26,
      transform: 'translate(-50%, -50%)',
      opacity: crossOp
    }}>
        <span className="absolute inset-0" style={{
        border: `2px solid ${INK}`
      }} />
        <span className="absolute left-1/2 top-0 -translate-x-1/2" style={{
        height: 7,
        width: 2,
        background: INK,
        transform: 'translate(-50%, -6px)'
      }} />
        <span className="absolute left-1/2 bottom-0 -translate-x-1/2" style={{
        height: 7,
        width: 2,
        background: INK,
        transform: 'translate(-50%, 6px)'
      }} />
        <span className="absolute top-1/2 left-0 -translate-y-1/2" style={{
        width: 7,
        height: 2,
        background: INK,
        transform: 'translate(-6px, -50%)'
      }} />
        <span className="absolute top-1/2 right-0 -translate-y-1/2" style={{
        width: 7,
        height: 2,
        background: INK,
        transform: 'translate(6px, -50%)'
      }} />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{
        width: 6,
        height: 6,
        background: ACID,
        border: `1px solid ${INK}`
      }} />
      </span>

      {/* "click to anchor" hint trailing the crosshair */}
      {hint > 0.001 && <span className="text-micro" style={{
      position: 'absolute',
      left: pos.x + 16,
      top: pos.y + 12,
      background: INK,
      color: '#fff',
      fontFamily: MONO,
      fontWeight: 700,
      padding: '3px 7px',
      whiteSpace: 'nowrap',
      opacity: hint,
      boxShadow: `2px 2px 0 0 ${ACID}`
    }}>
          click to anchor
        </span>}

      {/* click ripples */}
      <Ripple p={p} at={icon} t0={W_ICON - 0.006} />
      <Ripple p={p} at={pick} t0={W_PICK - 0.006} />
      <Ripple p={p} at={target} t0={W_TARGET - 0.006} />
    </div>;
};

export { PickerCursor };
