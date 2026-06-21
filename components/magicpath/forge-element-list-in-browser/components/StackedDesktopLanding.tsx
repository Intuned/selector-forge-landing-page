'use client';

import React from 'react';
import { LeftColumn } from './LeftColumn';
import { StackedScrollDemo } from './StackedScrollDemo';

/* ============================================================================
   STACKED DESKTOP LANDING — narrow-but-desktop (md→lg) layout
   ----------------------------------------------------------------------------
   Between the phone landing (<md) and the side-by-side cinematic (lg+), a
   desktop window narrowed to ~768–1023px is too narrow for two columns but too
   wide / wheel-driven for the phone stack. Here we keep the real desktop pieces
   but STACK them: the manifesto hero fills the first screen, then the same
   cinematic stage (StackedScrollDemo) plays below it on natural page scroll.
   ============================================================================ */
export const StackedDesktopLanding: React.FC = () => {
  return <div className="w-full bg-white">
      {/* Hero fills the first viewport; bottom rule hands off to the demo. */}
      <div className="h-screen w-full">
        <LeftColumn vAlign="spread" xAlign="center" divider="bottom" />
      </div>
      <StackedScrollDemo />
    </div>;
};
