'use client';

import React from 'react';
import { ACID, MONO } from '../shared/tokens';
import { clamp, seg } from '../shared/math';
import { SHIP_A } from '../shared/constants';
import { ProgressRail } from './ProgressRail';
import { SegmentedControl } from './SegmentedControl';
import { BrowserWindow } from './browser/BrowserWindow';
import { ShipStage } from './ShipStage';
import { CaptionBar } from './CaptionBar';

/* ============================================================================
   FORGE STAGE — the sticky cinematic frame, driven purely by progress `p` (0..1)
   ----------------------------------------------------------------------------
   Extracted from RightColumn so the SAME stage can be powered by two different
   scroll engines without duplicating its markup:
     • RightColumn      — the lg+ desktop column, an inner overflow scroller with
                          a wheel-hijack easing engine.
     • StackedScrollDemo — the narrow-desktop (md→lg) stacked layout, driven by
                          plain document scroll below the hero.
   It expects to live inside a tall (≈480vh) relatively-positioned track: it pins
   itself with `sticky top-0` and renders one 100vh frame whose browser → ship
   contents cross-fade as `p` advances.
   ============================================================================ */
export const ForgeStage: React.FC<{ p: number }> = ({ p }) => {
  const wBrowser = clamp(1 - seg(p, SHIP_A - 0.02, SHIP_A + 0.05));
  const wShip = seg(p, SHIP_A - 0.01, SHIP_A + 0.06);
  // Opaque, page-matching cover that sweeps over the browser as we enter SHIP.
  // It fully lands just before the ship content begins its own intro, so the
  // outgoing browser and the incoming ship are never both translucent at once
  // (that double-transparency was the muddy LIST→SHIP overlap).
  const wShipCover = seg(p, SHIP_A - 0.02, SHIP_A);
  const hintOpacity = 1 - clamp(p / 0.02);
  const dotGrid: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1.4px, transparent 1.4px)',
    backgroundSize: '18px 18px'
  };
  return <div className="sticky top-0 flex w-full items-center justify-center overflow-hidden" style={{
    height: '100vh'
  }}>
      <ProgressRail p={p} />

      <div className="pointer-events-none absolute bottom-8 left-1/2 z-30 -translate-x-1/2" style={{
      opacity: hintOpacity
    }}>
        <span className="inline-flex items-center gap-1.5 border-2 border-black px-3 py-1.5 text-badge" style={{
        background: ACID,
        boxShadow: '3px 3px 0 0 #000',
        fontFamily: MONO,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#000'
      }}>
          Scroll
          <span className="text-small" style={{
          display: 'inline-block',
          lineHeight: 1,
          animation: 'forge-scroll-bounce 1.2s ease-in-out infinite'
        }}>↓</span>
        </span>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center px-6 pr-14 xl:pl-10 xl:pr-24">
        <div className="absolute top-8 left-1/2 z-20 w-full -translate-x-1/2 px-10" style={{
        opacity: wBrowser,
        pointerEvents: wBrowser > 0.5 ? 'auto' : 'none'
      }}>
          <SegmentedControl p={p} />
        </div>

        {/* Reserve a fixed top/bottom band (segmented control + caption) so the
            centered browser never reaches into the caption pinned at bottom-7.
            calc keeps ≥100px clear each side regardless of viewport height. */}
        <div className="relative flex w-full items-center justify-center" style={{
        height: 'min(880px, calc(100% - 200px))'
      }}>
          {/* Outgoing browser — kept fully OPAQUE; the cover above sweeps over
              it, so it never turns into a translucent layer. `isolation:
              isolate` contains the browser's inner z-indexes (chrome bar,
              extension popup) so they can't paint above the cover. */}
          <div className="absolute inset-0 flex h-full w-full items-center justify-center" style={{
          zIndex: 0,
          isolation: 'isolate',
          pointerEvents: wShipCover > 0.5 ? 'none' : 'auto',
          display: wShipCover >= 0.999 ? 'none' : 'flex'
        }}>
            <BrowserWindow p={p} />
          </div>
          {/* Ship — an opaque, page-matching panel covers the browser first,
              THEN the ship content fades/rises in on the clean panel. Sits
              above the isolated browser layer so the cover hides all of it. */}
          <div className="absolute inset-0 flex w-full items-center justify-center" style={{
          zIndex: 1,
          pointerEvents: wShip > 0.5 ? 'auto' : 'none',
          display: wShipCover <= 0.001 ? 'none' : 'flex'
        }}>
            <div className="absolute inset-0" style={{
            backgroundColor: '#fff',
            ...dotGrid,
            opacity: wShipCover
          }} />
            <div className="relative flex w-full max-w-[680px] items-center justify-center px-2">
              <ShipStage p={p} />
            </div>
          </div>
        </div>

        <div style={{
        opacity: wBrowser
      }}>
          <CaptionBar p={p} />
        </div>
      </div>
    </div>;
};
