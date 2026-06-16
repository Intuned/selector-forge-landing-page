'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ACID, INK, MONO } from '../../shared/tokens';
import { ForgeMark } from '../ForgeLogo';
import { lerp, band } from '../../shared/math';
import { LIST_A, CHROME_H, W_ICON } from '../../shared/constants';
import type { CG } from '../../shared/types';
import { PAGE } from '../../shared/data';
import { GovPage } from './GovPage';
import { FloatingForge } from './FloatingForge';
import { InspectHighlight } from './InspectHighlight';
import { PickerCursor } from './PickerCursor';

/* small callout that points at the extension icon before the click */
const IconCallout: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const vis = band(p, 0.02, W_ICON - 0.004, 0.012);
  if (vis <= 0.001) return null;
  return <div className="pointer-events-none absolute" style={{
    top: CHROME_H + 8,
    right: 8,
    zIndex: 22,
    opacity: vis,
    transform: `translateY(${lerp(-4, 0, vis)}px)`
  }}>
      <span aria-hidden className="absolute" style={{
      right: 15,
      top: -8,
      width: 15,
      height: 15,
      background: INK,
      borderTop: `2px solid ${ACID}`,
      borderRight: `2px solid ${ACID}`,
      transform: 'rotate(-45deg)'
    }} />
      <span style={{
      position: 'relative',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      background: INK,
      padding: '9px 13px',
      whiteSpace: 'nowrap',
      border: `2px solid ${ACID}`,
      boxShadow: `5px 5px 0 0 ${ACID}`
    }}>
        <span style={{
        width: 9,
        height: 9,
        flexShrink: 0,
        background: ACID,
        animation: 'forgeIconPulse 1.4s ease-in-out infinite'
      }} />
        <span className="text-small" style={{
        fontFamily: MONO,
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '0.02em'
      }}>click selector-forge to start</span>
      </span>
    </div>;
};

/* ============================================================================
   BROWSER WINDOW — single chrome bar (from steady-castle-2639, recolored acid):
   macOS dots + one big omnibox + the extension button (the popup drops from it).
   The window measures the icon / "Pick element" button / target value so the
   PickerCursor can drive to each.
   ============================================================================ */
const Dot: React.FC<{
  acid?: boolean;
}> = ({
  acid
}) => <span style={{
  width: 11,
  height: 11,
  borderRadius: 11,
  background: acid ? ACID : '#fff',
  border: `1.5px solid ${INK}`,
  display: 'inline-block'
}} />;
const BrowserWindow: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const isList = p >= LIST_A;
  const url = isList ? PAGE.filesUrl : PAGE.url;
  const iconPulse = band(p, 0.0, W_ICON - 0.002, 0.02);
  const iconPressed = band(p, W_ICON - 0.008, W_ICON + 0.006, 0.004);
  const winRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const pickRef = useRef<HTMLButtonElement>(null);
  const targetRef = useRef<HTMLElement>(null);
  const [cg, setCg] = useState<CG>({
    icon: {
      x: 0,
      y: 0
    },
    pick: {
      x: 0,
      y: 0
    },
    target: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    }
  });
  const measure = useCallback(() => {
    const w = winRef.current;
    if (!w) return;
    const wr = w.getBoundingClientRect();
    const center = (el: Element | null) => {
      if (!el) return {
        x: 0,
        y: 0
      };
      const r = el.getBoundingClientRect();
      return {
        x: r.left + r.width / 2 - wr.left,
        y: r.top + r.height / 2 - wr.top
      };
    };
    const rect = (el: Element | null) => {
      if (!el) return {
        x: 0,
        y: 0,
        w: 0,
        h: 0
      };
      const r = el.getBoundingClientRect();
      return {
        x: r.left - wr.left,
        y: r.top - wr.top,
        w: r.width,
        h: r.height
      };
    };
    setCg({
      icon: center(iconRef.current),
      pick: center(pickRef.current),
      target: rect(targetRef.current)
    });
  }, []);
  useEffect(() => {
    measure();
    const t1 = window.setTimeout(measure, 150);
    const t2 = window.setTimeout(measure, 450);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);
  return <div ref={winRef} className="relative flex h-full w-full flex-col bg-white" style={{
    height: '100%',
    border: `2px solid ${INK}`,
    boxShadow: `10px 10px 0 0 ${INK}`,
    overflow: 'visible'
  }}>
      {/* CHROME BAR — single calm bar */}
      <div className="flex items-center gap-2.5" style={{
      height: CHROME_H,
      flexShrink: 0,
      padding: '0 12px',
      background: '#F2F2F2',
      borderBottom: `2px solid ${INK}`,
      position: 'relative',
      zIndex: 2
    }}>
        <span style={{
        display: 'flex',
        gap: 7
      }}>
          <Dot />
          <Dot />
          <Dot acid />
        </span>

        {/* omnibox / URL pill */}
        <div style={{
        flex: 1,
        minWidth: 0,
        height: 28,
        background: '#fff',
        border: `2px solid ${INK}`,
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        padding: '0 10px',
        overflow: 'hidden'
      }}>
          <svg width="10" height="11" viewBox="0 0 10 11" style={{
          flexShrink: 0
        }}>
            <rect x="1" y="4.6" width="8" height="6" fill={INK} />
            <path d="M2.6 4.6 V3.1 a2.4 2.4 0 0 1 4.8 0 V4.6" fill="none" stroke={INK} strokeWidth="1.2" />
          </svg>
          <span className="text-label" style={{
          fontFamily: MONO,
          color: '#374151',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>{url}</span>
        </div>

        {/* extension toolbar button (the popup drops from here) */}
        <span ref={iconRef} title="selector-forge" style={{
        position: 'relative',
        width: 24,
        height: 24,
        background: ACID,
        border: `2px solid ${INK}`,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: iconPressed > 0.4 ? 'scale(0.86)' : 'scale(1)',
        animation: iconPulse > 0.5 ? 'forgeIconPulse 1.4s ease-in-out infinite' : 'none'
      }}>
          <ForgeMark fill={INK} aria-hidden style={{
          width: 15,
          height: 'auto',
          display: 'block'
        }} />
        </span>
      </div>

      {/* CONTENT VIEWPORT — clipped (page lives here) */}
      <div style={{
      position: 'relative',
      flex: 1,
      overflow: 'hidden'
    }}>
        <GovPage p={p} targetRef={targetRef} />
      </div>

      {/* OVERLAYS (above the clipped viewport) */}
      <IconCallout p={p} />
      <FloatingForge p={p} isList={isList} pickRef={pickRef} />
      <InspectHighlight p={p} target={cg.target} />
      <PickerCursor p={p} cg={cg} />
    </div>;
};

export { BrowserWindow };
