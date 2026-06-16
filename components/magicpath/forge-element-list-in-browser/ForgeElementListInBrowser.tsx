'use client';

import React from 'react';
import { LeftColumn } from './components/LeftColumn';
import { RightColumn } from './components/RightColumn';

/* ============================================================================
   selector-forge — "Forge — Element & List · In-Browser"
   Base = "Forge — Element & List" (steady-cloud-2184): light brutalist, fixed
   left manifesto + right scroll track with sticky stage, single progress P.
   The right stage wraps ONE solicitation page (Details + Files) inside a mock
   BROWSER. Frame = the calmer single chrome bar from steady-castle-2639 (macOS
   dots + one big omnibox + extension button), recolored to acid. The extension
   POPUP operates it: a visible CURSOR clicks the extension icon (popup drops
   from it), clicks "Pick element", then morphs into an inspect crosshair that
   hovers the target value (devtools-style "selecting" highlight) and clicks to
   anchor — ELEMENT (acid connector from solid-city-1021) → the browser scrolls
   down to the Files section → LIST (pick one, get all) → SHIP ("Every selector,
   judged." ending from solid-city-1021). Acid #C8FF2E is the only accent.
   ============================================================================ */
export const ForgeElementListInBrowser: React.FC = () => {
  return <div className="flex h-screen w-screen overflow-hidden bg-white">
      <div className="relative h-full w-[40%] shrink-0">
        <LeftColumn vAlign="spread" xAlign="center" />
      </div>
      <div className="relative h-full w-[60%] shrink-0">
        <RightColumn />
      </div>
    </div>;
};
