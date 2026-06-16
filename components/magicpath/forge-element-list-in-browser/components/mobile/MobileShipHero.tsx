'use client';

import React, { useState } from 'react';
import { ACID, INK, MONO, HEAD, BODY, GITHUB, TIER_CTA } from '../../shared/tokens';

/* ============================================================================
   MOBILE SHIP HERO — the closing hero. Mirrors the desktop ShipStage in full
   (headline, both use-case cards, CTA row, CLI "coming soon" + email capture,
   blog link) but stacked into a single narrow column instead of the desktop
   two-up grid. This replaces the small numbered "Ship" frame.
   ============================================================================ */
const UseCaseCard: React.FC<{ index: string; title: string; children: React.ReactNode }> = ({
  index,
  title,
  children,
}) => (
  <div style={{ border: `2px solid ${INK}`, background: INK, boxShadow: `6px 6px 0 0 ${ACID}`, padding: '14px 14px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <span className="text-micro" style={{ fontFamily: MONO, fontWeight: 700, color: '#000', background: ACID, padding: '2px 6px' }}>{index}</span>
      <span className="text-badge" style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>{title}</span>
    </div>
    {children}
  </div>
);

export const MobileShipHero: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const dotGrid: React.CSSProperties = {
    backgroundImage: 'radial-gradient(rgba(0,0,0,0.025) 1.4px, transparent 1.4px)',
    backgroundSize: '18px 18px',
  };
  return (
    <section
      className="flex w-full flex-col justify-center bg-white"
      style={{ minHeight: '100svh', ...dotGrid, borderTop: `2px solid ${INK}`, padding: '56px 20px' }}
    >
      {/* headline */}
      <h2 className="text-display-ship-mobile" style={{ fontFamily: HEAD, fontWeight: 800, lineHeight: 1.0, letterSpacing: '-0.03em', color: INK, margin: '0 0 20px' }}>
        Every selector,{' '}
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ position: 'relative', zIndex: 1 }}>judged.</span>
          <span aria-hidden style={{ position: 'absolute', left: '-1%', right: '-1%', bottom: '8%', height: 8, background: ACID, zIndex: 0 }} />
        </span>
      </h2>

      {/* use-case cards (stacked) */}
      <div className="flex flex-col gap-4" style={{ marginBottom: 20 }}>
        <UseCaseCard index="01" title="PLAYWRIGHT TEST">
          <div className="text-label" style={{ fontFamily: MONO, lineHeight: 1.55, color: '#e5e7eb', wordBreak: 'break-all' }}>
            <span style={{ color: '#6b7280' }}>await </span>
            <span style={{ color: '#fff' }}>page.</span>
            <span style={{ color: ACID }}>locator</span>
            <span style={{ color: '#fff' }}>(</span>
            <span style={{ color: '#9be3ff' }}>{'"xpath=//dt[…]/…::dd"'}</span>
            <span style={{ color: '#fff' }}>).</span>
            <span style={{ color: ACID }}>textContent</span>
            <span style={{ color: '#fff' }}>()</span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="text-badge" style={{ fontFamily: MONO, fontWeight: 700, color: '#000', background: ACID, border: '2px solid #000', padding: '3px 7px', boxShadow: '3px 3px 0 0 #000' }}>✓ PASS</span>
            <span className="text-label" style={{ fontFamily: BODY, color: '#9aa1ab' }}>1 passed (0.4s)</span>
          </div>
        </UseCaseCard>

        <UseCaseCard index="02" title="SCRAPER">
          <pre className="text-label" style={{ fontFamily: MONO, lineHeight: 1.55, color: '#e5e7eb', margin: 0, whiteSpace: 'pre-wrap' }}>
            <span style={{ color: '#6b7280' }}>{'{'}</span>
            {'\n  '}
            <span style={{ color: ACID }}>{'"solicitationType"'}</span>
            <span style={{ color: '#fff' }}>: </span>
            <span style={{ color: '#9be3ff' }}>{'"Request for Proposal"'}</span>
            {'\n'}
            <span style={{ color: '#6b7280' }}>{'}'}</span>
          </pre>
          <div className="text-label" style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, fontFamily: BODY, color: '#9aa1ab' }}>
            <span style={{ width: 8, height: 8, background: ACID, border: '1.5px solid #fff', display: 'inline-block' }} />
            anchored — the right field, every time
          </div>
        </UseCaseCard>
      </div>

      {/* CTA row (side by side, wraps if tight) */}
      <div className="flex flex-wrap items-center gap-3" style={{ marginBottom: 18 }}>
        <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center" style={{ background: '#000', color: '#fff', fontFamily: BODY, fontWeight: 700, fontSize: TIER_CTA.font, padding: '13px 20px', textDecoration: 'none', border: '2px solid #000', boxShadow: `${TIER_CTA.shadow}px ${TIER_CTA.shadow}px 0 0 ${ACID}` }}>
          Add to Chrome
        </a>
        <a href={GITHUB} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center" style={{ background: '#fff', color: '#000', fontFamily: BODY, fontWeight: 600, fontSize: TIER_CTA.font, padding: '12px 18px', textDecoration: 'none', border: '2px solid #000' }}>
          View on GitHub →
        </a>
      </div>

      {/* CLI — COMING SOON */}
      <div style={{ border: `2px solid ${ACID}`, background: '#f6ffe1', padding: '14px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
          <span style={{ width: 8, height: 8, borderRadius: 8, background: ACID, border: '1.5px solid #000', display: 'inline-block', animation: 'forgeCaretBlink 1.2s steps(1) infinite' }} />
          <span className="text-badge" style={{ fontFamily: MONO, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#000', background: ACID, padding: '2px 7px', border: '2px solid #000' }}>CLI — COMING SOON</span>
        </div>
        <div className="text-small" style={{ fontFamily: BODY, color: '#374151', marginBottom: 12 }}>
          Drive it from your terminal: <code style={{ fontFamily: MONO, fontWeight: 700, color: '#000' }}>npx intuned forge pick</code>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if (email.trim()) setSent(true); }} className="flex flex-col gap-3">
          {!sent ? (
            <div className="flex items-stretch" style={{ border: '2px solid #000', background: '#fff', boxShadow: '3px 3px 0 0 #000' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setSent(false); }}
                placeholder="you@work.com"
                aria-label="email for CLI launch notification"
                className="text-small"
                style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', padding: '10px 10px', fontFamily: MONO, color: '#000' }}
              />
              <button type="submit" className="text-label" style={{ borderLeft: '2px solid #000', background: '#000', color: '#fff', padding: '10px 14px', fontFamily: MONO, fontWeight: 700, letterSpacing: '0.04em', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                GET NOTIFIED
              </button>
            </div>
          ) : (
            <div className="text-small" style={{ border: `2px solid ${ACID}`, background: '#fff', boxShadow: '3px 3px 0 0 #000', padding: '10px 12px', fontFamily: MONO, fontWeight: 700, color: '#000' }}>
              {"✓ you're on the list"}
            </div>
          )}
          <a href={GITHUB + '#readme'} target="_blank" rel="noreferrer" className="text-small" style={{ fontFamily: MONO, fontWeight: 700, color: '#000', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Why Static Selectors Fail →
          </a>
        </form>
      </div>
    </section>
  );
};
