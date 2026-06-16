'use client';

import React from 'react';
import { ACID, INK, MONO, BODY, INTUNED } from '../../shared/tokens';
import { IntunedLogo } from '../IntunedLogo';
import { MobileHero } from './MobileHero';
import { PickFrame, ElementFrame, ListFrame } from './MobileFrames';
import { MobileShipHero } from './MobileShipHero';

/* ============================================================================
   MOBILE LANDING — the full small-screen page: manifesto hero, three "how it
   works" frames (PICK → ELEMENT → LIST), then the ship hero (full desktop
   ship content). The mobile counterpart to the desktop ForgeElementListInBrowser;
   it scrolls as a normal document instead of scroll-jacking.
   ============================================================================ */
export const MobileLanding: React.FC = () => {
  const dotGrid: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1.4px, transparent 1.4px)',
    backgroundSize: '18px 18px',
  };
  return (
    <div className="w-full bg-white" style={dotGrid}>
      <MobileHero />

      <main className="flex flex-col gap-6" style={{ padding: '24px 20px 28px' }}>
        <div
          className="flex items-center gap-2 text-badge"
          style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: '0.14em', color: '#9ca3af', textTransform: 'uppercase' }}
        >
          <span style={{ width: 8, height: 8, background: ACID, border: `1.5px solid ${INK}` }} />
          How it works
        </div>

        <PickFrame />
        <ElementFrame />
        <ListFrame />
      </main>

      <MobileShipHero />

      <footer style={{ borderTop: `2px solid ${INK}`, padding: '18px 20px' }}>
        <a
          href={INTUNED}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex select-none items-center gap-2.5 text-gray-400 transition-colors duration-150 hover:text-black text-small"
          style={{ fontFamily: BODY }}
        >
          <span>Powered by</span>
          <IntunedLogo mono={false} aria-label="Intuned" style={{ height: 24, width: 'auto', display: 'block' }} />
        </a>
      </footer>
    </div>
  );
};
