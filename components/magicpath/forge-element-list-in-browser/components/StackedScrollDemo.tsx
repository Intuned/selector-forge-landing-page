'use client';

import React, { useState, useEffect, useRef } from 'react';
import { clamp } from '../shared/math';
import { ForgeStage } from './ForgeStage';

/* ============================================================================
   STACKED SCROLL DEMO — the cinematic stage, driven by plain document scroll
   ----------------------------------------------------------------------------
   The lg+ desktop puts the cinematic in a side column with its own wheel-hijack
   scroller (RightColumn). On narrow-but-desktop widths (md→lg) we instead stack
   it BELOW the hero and let it play on the page's natural scroll — no wheel
   hijack, so the hero above and the footer below scroll normally.

   Same shape as the desktop engine: a tall (480vh) track with a `sticky top-0`
   100vh ForgeStage. Progress `p` is just how far the track's top has travelled
   past the top of the viewport, 0..1 across the track's scrollable length.
   ============================================================================ */
const TRACK_VH = 480; // matches RightColumn's track height

export const StackedScrollDemo: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);

  useEffect(() => {
    const tr = trackRef.current;
    if (!tr) return;
    const compute = () => {
      // Skip work when this layout is hidden (display:none at other breakpoints):
      // a hidden node has a null offsetParent and a zeroed bounding rect.
      if (tr.offsetParent === null) return;
      const rect = tr.getBoundingClientRect();
      // Scrollable distance = track height minus the one sticky viewport it pins.
      const span = tr.offsetHeight - window.innerHeight;
      setP(span > 0 ? clamp(-rect.top / span) : 0);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute);
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return <div ref={trackRef} style={{ height: `${TRACK_VH}vh`, position: 'relative' }}>
      <ForgeStage p={p} />
    </div>;
};
