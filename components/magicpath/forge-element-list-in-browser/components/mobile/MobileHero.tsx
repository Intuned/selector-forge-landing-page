'use client';

import React from 'react';
import { ACID, INK, MONO, HEAD, BODY, GITHUB, INTUNED_PRICING, TIER_CTA, TIER_BADGE } from '../../shared/tokens';
import { useInstallTarget } from '../../shared/useInstallTarget';
import { ForgeMark } from '../ForgeLogo';

/* ============================================================================
   MOBILE HERO — the manifesto as a full-viewport opening screen. Same copy and
   brand language as the desktop LeftColumn, content vertically centered in a
   100svh column, with a "see it work ↓" scroll hint. Matches the prototype.
   ============================================================================ */
const Stamp: React.FC<{ bg: string; text: string; children: React.ReactNode }> = ({
  bg,
  text,
  children,
}) => (
  <span
    className="inline-flex items-center"
    style={{
      background: bg,
      color: text,
      border: `2px solid ${INK}`,
      boxShadow: `${TIER_BADGE.shadow}px ${TIER_BADGE.shadow}px 0 0 ${INK}`,
      padding: '4px 9px',
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: TIER_BADGE.font,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    }}
  >
    {children}
  </span>
);

export const MobileHero: React.FC = () => {
  const install = useInstallTarget();
  const dotGrid: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1.4px, transparent 1.4px)',
    backgroundSize: '18px 18px',
  };
  return (
    <header
      className="relative flex w-full flex-col justify-center"
      style={{ minHeight: '100svh', ...dotGrid, borderBottom: `2px solid ${INK}`, padding: '56px 20px' }}
    >
      <span
        className="inline-flex items-center gap-1.5 self-start bg-black text-white text-small"
        style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: '-0.02em', padding: '5px 9px' }}
      >
        <ForgeMark fill={ACID} aria-hidden style={{ height: 14, width: 'auto', display: 'block' }} />
        selector-forge
      </span>

      <h1
        className="text-display-mobile"
        style={{
          fontFamily: HEAD,
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          color: INK,
          margin: '22px 0 0',
        }}
      >
        Forged,
        <br />
        not{' '}
        <span className="relative inline-block">
          copied
          <span
            aria-hidden
            className="absolute -z-0"
            style={{
              left: '-4%',
              top: '48%',
              width: '108%',
              height: '0.16em',
              background: ACID,
              transform: 'rotate(-4deg)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.06)',
            }}
          />
        </span>
        .
      </h1>

      <p className="text-lead" style={{ fontFamily: BODY, fontWeight: 400, lineHeight: 1.5, color: '#1f2937', margin: '18px 0 0', maxWidth: 460 }}>
        Every selector is generated, stress-tested against the page, and certified before you see
        it. The brittle ones never survive.
      </p>

      <div className="flex flex-wrap items-center gap-3" style={{ marginTop: 26 }}>
        <a
          href={install.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-black text-white"
          style={{ fontFamily: BODY, fontWeight: 700, fontSize: TIER_CTA.font, padding: '13px 20px', border: `2px solid ${INK}`, boxShadow: `${TIER_CTA.shadow}px ${TIER_CTA.shadow}px 0 0 ${ACID}` }}
        >
          {install.label}
        </a>
        <a
          href={GITHUB}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center bg-white text-black"
          style={{ fontFamily: BODY, fontWeight: 600, fontSize: TIER_CTA.font, padding: '12px 18px', border: `2px solid ${INK}` }}
        >
          View on GitHub →
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-2.5" style={{ marginTop: 20 }}>
        <Stamp bg={ACID} text="#000">Free Tier</Stamp>
        <Stamp bg="#fff" text="#000">OPEN SOURCE</Stamp>
        <Stamp bg="#000" text="#fff">CHROME + FIREFOX</Stamp>
      </div>

      {/* Touch has no hover, so the desktop "Free Tier" popover can't work here —
          state the freemium model inline instead. */}
      <p className="text-body" style={{ fontFamily: BODY, lineHeight: 1.45, color: '#6b7280', margin: '12px 0 0', maxWidth: 460 }}>
        200 selectors/mo free · unlimited on any{' '}
        <a
          href={INTUNED_PRICING}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#374151', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2, textDecorationThickness: 2, textDecorationColor: ACID }}
        >
          Intuned plan
        </a>
        .
      </p>

      <div style={{ marginTop: 30 }}>
        <span className="text-small" style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: '0.04em', color: '#4b5563' }}>
          see it work{' '}
          <span style={{ display: 'inline-block', animation: 'forge-scroll-bounce 1.2s ease-in-out infinite' }}>↓</span>
        </span>
      </div>
    </header>
  );
};
