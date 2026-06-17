'use client';

import React, { useState } from 'react';
import { ACID, MONO, HEAD, BODY, GITHUB, INTUNED, TIER_CTA, TIER_BADGE } from '../shared/tokens';
import { useInstallTarget } from '../shared/useInstallTarget';
import { IntunedLogo } from './IntunedLogo';
import { ForgeMark } from './ForgeLogo';
import { FreeTierStamp } from './FreeTierStamp';

/* ============================================================================
   LEFT COLUMN — the manifesto rail (never scrolls).
   Positioning is configurable so we can place the content in the column.
     vAlign: 'spread' — badge top, manifesto centered, footer bottom (default)
             'top'    — badge + manifesto grouped near the top, footer bottom
     xAlign: 'left'   — block spans the column, left-aligned (default)
             'center' — block is constrained + horizontally CENTERED in the
                        column, but its text stays LEFT-aligned (shared left edge)
   ============================================================================ */
type VAlign = 'spread' | 'top';
type XAlign = 'left' | 'center';

const LeftColumn: React.FC<{ vAlign?: VAlign; xAlign?: XAlign }> = ({
  vAlign = 'spread',
  xAlign = 'left'
}) => {
  const [pressed, setPressed] = useState(false);
  const install = useInstallTarget();
  const dotGrid: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1.4px, transparent 1.4px)',
    backgroundSize: '18px 18px'
  };
  // Manifesto sits centered between the anchors for 'spread', tucked under the
  // badge for 'top' (footer pushed to the bottom via mt-auto).
  const manifestoMargin = vAlign === 'spread' ? 'my-auto' : 'mt-10';
  const footerMargin = vAlign === 'spread' ? '' : 'mt-auto';
  // 'center' constrains the content to a column and centers that block
  // horizontally; text inside stays left-aligned.
  const blockClass = xAlign === 'center' ? 'mx-auto max-w-[480px]' : '';
  return <div className="relative h-full w-full bg-white overflow-hidden" style={dotGrid}>
      <div className="absolute top-0 right-0 h-full w-[2px] bg-black" />
      <div className="relative flex h-full flex-col px-8 py-9 xl:px-12 xl:py-12">
        <div className={`flex h-full w-full flex-col ${blockClass}`}>
          <div>
            <span className="inline-flex items-center gap-2 bg-black px-2.5 py-1.5 text-white text-body" style={{
            fontFamily: MONO,
            fontWeight: 700,
            letterSpacing: '-0.02em'
          }}>
              <ForgeMark fill={ACID} aria-hidden style={{
              height: '15px',
              width: 'auto',
              display: 'block'
            }} />
              selector-forge
            </span>
          </div>

          <div className={`flex flex-col gap-7 ${manifestoMargin}`}>
            <h1 className="text-black text-display" style={{
            fontFamily: HEAD,
            fontWeight: 800,
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
            margin: 0
          }}>
              Forged,
              <br />
              not{' '}
              <span className="relative inline-block">
                copied
                <span aria-hidden className="absolute left-[-4%] top-[48%] -z-0" style={{
                width: '108%',
                height: '0.16em',
                background: ACID,
                transform: 'rotate(-4deg)',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.06)'
              }} />
              </span>
              <span className="relative">.</span>
            </h1>

            <p className="max-w-md text-gray-800 text-lead" style={{
            fontFamily: BODY,
            fontWeight: 400,
            lineHeight: 1.5,
            margin: 0
          }}>
              Every selector is generated, stress-tested against the page, and
              certified before you see it. The brittle ones never survive.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a href={install.href} target="_blank" rel="noopener noreferrer" onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} className="inline-flex select-none items-center bg-black px-6 py-3 text-white transition-all duration-100" style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: `${TIER_CTA.font}px`,
              boxShadow: pressed ? '0 0 0 0 ' + ACID : `${TIER_CTA.shadow}px ${TIER_CTA.shadow}px 0 0 ${ACID}`,
              transform: pressed ? 'translate(2px, 2px)' : 'translate(0,0)'
            }}>
                {install.label}
              </a>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center border-2 border-black bg-white px-6 py-3 text-black transition-colors duration-150 hover:bg-black hover:text-white" style={{
              fontFamily: BODY,
              fontWeight: 600,
              fontSize: `${TIER_CTA.font}px`
            }}>
                View on GitHub →
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <FreeTierStamp />
              <Stamp bg="#fff" text="#000">OPEN SOURCE</Stamp>
              <Stamp bg="#000" text="#fff">CHROME + FIREFOX</Stamp>
            </div>
          </div>

          <div className={footerMargin}>
            <a href={INTUNED} target="_blank" rel="noopener noreferrer" className="group inline-flex select-none items-center gap-2.5 text-gray-400 transition-colors duration-150 hover:text-black text-small" style={{
            fontFamily: BODY
          }}>
              <span>Powered by</span>
              <IntunedLogo mono={false} aria-label="Intuned" style={{
              height: '26px',
              width: 'auto',
              display: 'block'
            }} />
            </a>
          </div>
        </div>
      </div>
    </div>;
};
const Stamp: React.FC<{
  bg: string;
  text: string;
  children: React.ReactNode;
}> = ({
  bg,
  text,
  children
}) => <span className="inline-flex items-center border-2 border-black px-2.5 py-1" style={{
  background: bg,
  color: text,
  fontFamily: MONO,
  fontWeight: 700,
  fontSize: `${TIER_BADGE.font}px`,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  boxShadow: `${TIER_BADGE.shadow}px ${TIER_BADGE.shadow}px 0 0 #000`,
  borderRadius: 0
}}>
    {children}
  </span>;

export { LeftColumn };
