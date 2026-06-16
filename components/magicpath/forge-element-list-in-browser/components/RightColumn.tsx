'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ACID, MONO } from '../shared/tokens';
import { clamp, seg } from '../shared/math';
import { SHIP_A } from '../shared/constants';
import { ProgressRail } from './ProgressRail';
import { SegmentedControl } from './SegmentedControl';
import { BrowserWindow } from './browser/BrowserWindow';
import { ShipStage } from './ShipStage';
import { CaptionBar } from './CaptionBar';

/* ============================================================================
   RIGHT COLUMN — scroll track + sticky stage (base engine)
   ============================================================================ */
// Per-frame easing for the smoothed scroll (0..1). Higher = snappier, lower =
// floatier. ~0.16 gently smooths chunky mouse-wheel steps without feeling laggy
// on a trackpad. The eased value reaches ~90% of a jump in ~0.2s at 60fps.
const SMOOTH = 0.16;
const RightColumn: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  // Smooth, scroll-anywhere engine: a wheel from ANYWHERE on the page feeds a
  // target offset, and a rAF loop eases the scroller toward it (so notchy mouse
  // wheels animate smoothly). Native scroll (scrollbar drag, touch) still works:
  // while the easing loop is idle, those scroll events resync the target.
  const targetRef = useRef(0); // desired scrollTop (px)
  const currentRef = useRef(0); // eased scrollTop (px)
  const rafRef = useRef<number | null>(null);
  const maxScroll = useCallback(() => {
    const sc = scrollerRef.current;
    const tr = trackRef.current;
    if (!sc || !tr) return 1;
    const viewport = sc.clientHeight || window.innerHeight;
    return Math.max(1, tr.offsetHeight - viewport);
  }, []);
  const tick = useCallback(() => {
    const sc = scrollerRef.current;
    if (!sc) {
      rafRef.current = null;
      return;
    }
    const max = maxScroll();
    const diff = targetRef.current - currentRef.current;
    currentRef.current = Math.abs(diff) < 0.5 ? targetRef.current : currentRef.current + diff * SMOOTH;
    sc.scrollTop = currentRef.current;
    setP(clamp(currentRef.current / max));
    // Keep rafRef non-null while easing so the scroll listener below ignores our
    // own programmatic scrollTop writes (only genuine user scroll resyncs).
    rafRef.current = currentRef.current === targetRef.current ? null : requestAnimationFrame(tick);
  }, [maxScroll]);
  const kick = useCallback(() => {
    if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
  }, [tick]);
  useEffect(() => {
    const sc = scrollerRef.current;
    if (!sc) return;
    currentRef.current = targetRef.current = sc.scrollTop;
    setP(clamp(sc.scrollTop / maxScroll()));
    // Own the wheel everywhere: preventDefault so the cursor's position doesn't
    // matter and there's no double-scroll when it's over the scroller. deltaMode
    // is normalized so line/page-based mice match pixel mice.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? sc.clientHeight : 1;
      targetRef.current = Math.max(0, Math.min(maxScroll(), targetRef.current + e.deltaY * unit));
      kick();
    };
    // A scroll while the easing loop is idle = user dragging the scrollbar, touch
    // momentum, or keyboard — adopt it as the new target so the next wheel
    // continues from there.
    const onScroll = () => {
      if (rafRef.current != null) return;
      currentRef.current = targetRef.current = sc.scrollTop;
      setP(clamp(sc.scrollTop / maxScroll()));
    };
    const onResize = () => {
      const max = maxScroll();
      targetRef.current = Math.min(targetRef.current, max);
      currentRef.current = Math.min(currentRef.current, max);
      setP(clamp(currentRef.current / max));
    };
    window.addEventListener('wheel', onWheel, {
      passive: false
    });
    sc.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('wheel', onWheel);
      sc.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [kick, maxScroll]);
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
  return <div ref={scrollerRef} className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-white" style={dotGrid}>
      <div ref={trackRef} style={{
      height: '480vh',
      position: 'relative'
    }}>
        <div className="sticky top-0 flex w-full items-center justify-center overflow-hidden" style={{
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
        </div>
      </div>
    </div>;
};

export { RightColumn };
