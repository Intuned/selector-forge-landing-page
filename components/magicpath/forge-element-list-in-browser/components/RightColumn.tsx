'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clamp } from '../shared/math';
import { ForgeStage } from './ForgeStage';

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
      // This desktop scroll engine still mounts below the `lg` breakpoint, where
      // its container is `display:none` and the mobile landing is the live page.
      // A hidden scroller has a null offsetParent — bail WITHOUT preventDefault so
      // we don't hijack (and kill) native wheel scrolling on the mobile layout.
      if (sc.offsetParent === null) return;
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
  const dotGrid: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1.4px, transparent 1.4px)',
    backgroundSize: '18px 18px'
  };
  return <div ref={scrollerRef} className="relative h-full w-full overflow-y-auto overflow-x-hidden bg-white" style={dotGrid}>
      <div ref={trackRef} style={{
      height: '480vh',
      position: 'relative'
    }}>
        <ForgeStage p={p} />
      </div>
    </div>;
};

export { RightColumn };
