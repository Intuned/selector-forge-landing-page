'use client';

import React from 'react';
import type { Story } from '@ladle/react';
import { ACID, MONO, HEAD, BODY, GITHUB, INTUNED, TIER_CTA, TIER_BADGE } from '../shared/tokens';
import { IntunedLogo } from './IntunedLogo';

/* ============================================================================
   HERO FRAMING — comparison board for the "FREE" stamp question.

   Throwaway visual scratchpad (NOT shipped): renders the hero's bottom block
   (CTA row + stamp row + optional pricing line + "Powered by Intuned") so we
   can eyeball every honest way to frame the freemium model:
     · open-source extension → Chrome build talks to the Intuned cloud
     · cloud generates/certifies the selectors (metered)
     · 200 selectors/mo free · unlimited on any paid Intuned plan
   The bare `FREE` stamp overclaims; these are the candidates to replace it.
   ============================================================================ */

const dotGrid: React.CSSProperties = {
  backgroundImage: 'radial-gradient(rgba(0,0,0,0.02) 1.4px, transparent 1.4px)',
  backgroundSize: '18px 18px'
};

const Stamp: React.FC<{ bg: string; text: string; children: React.ReactNode }> = ({
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

/* A stamp that reveals the freemium breakdown in a brutalist popover on hover
   (or focus). Keeps the hero a single calm word while the honest detail is one
   hover away. `forceOpen` pins it open so the board screenshots show it. */
const PopupStamp: React.FC<{ label: string; forceOpen?: boolean }> = ({ label, forceOpen }) => {
  const [open, setOpen] = React.useState(false);
  const show = open || forceOpen;
  return <span className="relative inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} className="inline-flex cursor-help items-center border-2 border-black px-2.5 py-1" style={{
        background: ACID,
        color: '#000',
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: `${TIER_BADGE.font}px`,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        boxShadow: show ? `0 0 0 0 #000` : `${TIER_BADGE.shadow}px ${TIER_BADGE.shadow}px 0 0 #000`,
        transform: show ? 'translate(2px,2px)' : 'translate(0,0)',
        transition: 'box-shadow 0.1s ease, transform 0.1s ease',
        borderRadius: 0
      }}>
        {label}
        <span aria-hidden style={{ marginLeft: 6, fontSize: '9px', lineHeight: 1 }}>▾</span>
      </button>

      {/* popover */}
      <span role="tooltip" className="absolute left-0 z-30 flex flex-col" style={{
        bottom: 'calc(100% + 10px)',
        width: 244,
        background: '#fff',
        border: '2px solid #000',
        boxShadow: '5px 5px 0 0 #000',
        padding: '11px 12px',
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(4px)',
        transition: 'opacity 0.12s ease, transform 0.12s ease',
        pointerEvents: show ? 'auto' : 'none'
      }}>
        <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: '10px', letterSpacing: '0.12em', color: '#000', background: ACID, border: '2px solid #000', padding: '1px 6px', alignSelf: 'flex-start', marginBottom: 9 }}>
          HOW FREE WORKS
        </span>
        <span style={{ fontFamily: BODY, fontSize: '13px', lineHeight: 1.45, color: '#111' }}>
          <strong>200 selectors / month</strong>, free — forever.
        </span>
        <span style={{ fontFamily: BODY, fontSize: '13px', lineHeight: 1.45, color: '#111', marginTop: 4 }}>
          Need more? <strong>Unlimited</strong> on any paid Intuned plan.
        </span>
        <span style={{ fontFamily: MONO, fontSize: '10.5px', lineHeight: 1.4, color: '#6b7280', marginTop: 9, borderTop: '1px solid #e5e7eb', paddingTop: 8 }}>
          Extension is open source · selectors are forged &amp; certified in the Intuned cloud.
        </span>
        {/* caret */}
        <span aria-hidden style={{ position: 'absolute', top: '100%', left: 18, width: 10, height: 10, background: '#fff', borderRight: '2px solid #000', borderBottom: '2px solid #000', transform: 'translateY(-6px) rotate(45deg)' }} />
      </span>
    </span>;
};

/* The real hero's CTA row + stamp row + footer, with the FREE stamp and an
   optional under-stamp pricing line swapped per variant. When `popup` is set,
   the FREE stamp becomes a hover-popover chip instead of a plain stamp. */
const HeroBottom: React.FC<{ freeStamp: string; pricingLine?: string | null; popup?: boolean; popupOpen?: boolean }> = ({
  freeStamp,
  pricingLine,
  popup,
  popupOpen
}) => <div className="flex flex-col gap-7">
    <div className="flex flex-wrap items-center gap-4">
      <span className="inline-flex select-none items-center bg-black px-6 py-3 text-white" style={{
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: `${TIER_CTA.font}px`,
        boxShadow: `${TIER_CTA.shadow}px ${TIER_CTA.shadow}px 0 0 ${ACID}`
      }}>
        Add to Chrome
      </span>
      <span className="inline-flex items-center border-2 border-black bg-white px-6 py-3 text-black" style={{
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: `${TIER_CTA.font}px`
      }}>
        View on GitHub →
      </span>
    </div>

    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-3">
        {popup ? <PopupStamp label={freeStamp} forceOpen={popupOpen} /> : <Stamp bg={ACID} text="#000">{freeStamp}</Stamp>}
        <Stamp bg="#fff" text="#000">OPEN SOURCE</Stamp>
        <Stamp bg="#000" text="#fff">CHROME + FIREFOX</Stamp>
      </div>
      {pricingLine ? <p style={{
        fontFamily: BODY,
        fontSize: '13px',
        lineHeight: 1.4,
        color: '#6b7280',
        margin: 0
      }}>
          {pricingLine}
        </p> : null}
    </div>

    <div>
      <span className="group inline-flex select-none items-center gap-2.5 text-gray-400" style={{
        fontFamily: BODY,
        fontSize: '13px'
      }}>
        <span>Powered by</span>
        <IntunedLogo mono={false} aria-label="Intuned" style={{ height: '26px', width: 'auto', display: 'block' }} />
      </span>
    </div>
  </div>;

/* One labeled card in the comparison board. */
const Variant: React.FC<{ label: string; note?: string; children: React.ReactNode }> = ({
  label,
  note,
  children
}) => <div className="border-2 border-black bg-white p-6" style={{ boxShadow: '5px 5px 0 0 #000', ...dotGrid }}>
    <div className="mb-5 flex items-baseline gap-3">
      <span style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#000',
        background: ACID,
        border: '2px solid #000',
        padding: '2px 8px'
      }}>{label}</span>
      {note ? <span style={{ fontFamily: BODY, fontSize: '12.5px', color: '#6b7280' }}>{note}</span> : null}
    </div>
    {children}
  </div>;

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => <h2 style={{
  fontFamily: HEAD,
  fontWeight: 800,
  fontSize: '22px',
  letterSpacing: '-0.02em',
  color: '#000',
  margin: '8px 0 2px'
}}>{children}</h2>;

const PRICING = '200 selectors/mo free · unlimited on any Intuned plan';

export default { title: 'Experiments/Hero Framing' };

/* The whole board on one canvas, so every option is comparable at a glance. */
export const AllFramings: Story = () => <div className="min-h-screen w-full bg-white p-10" style={dotGrid}>
    <div className="mx-auto flex max-w-[760px] flex-col gap-6">
      <div>
        <h1 style={{ fontFamily: HEAD, fontWeight: 800, fontSize: '30px', letterSpacing: '-0.03em', color: '#000', margin: 0 }}>
          Hero framing — the “FREE” stamp
        </h1>
        <p style={{ fontFamily: BODY, fontSize: '14px', color: '#4b5563', margin: '8px 0 0', maxWidth: 620 }}>
          Open-source extension; the Chrome build connects to the Intuned cloud, which generates &amp;
          certifies selectors (metered: 200/mo free, unlimited on a paid Intuned plan). The bare
          <strong> FREE</strong> stamp overclaims — below are the honest candidates, in real hero styling.
        </p>
      </div>

      <SectionTitle>Stamp wording (no pricing line)</SectionTitle>
      <Variant label="A" note="FREE TIER — smallest honest change">
        <HeroBottom freeStamp="FREE TIER" />
      </Variant>
      <Variant label="B" note="200 FREE / MO — concrete allowance in the stamp">
        <HeroBottom freeStamp="200 FREE / MO" />
      </Variant>
      <Variant label="C" note="FREE TO START — momentum, no number to age">
        <HeroBottom freeStamp="FREE TO START" />
      </Variant>
      <Variant label="D" note="FREE (current) — punchiest, but slightly overclaims">
        <HeroBottom freeStamp="FREE" />
      </Variant>

      <SectionTitle>With an under-stamp pricing line</SectionTitle>
      <Variant label="E" note="FREE TIER + clarifier">
        <HeroBottom freeStamp="FREE TIER" pricingLine={PRICING} />
      </Variant>
      <Variant label="F" note="FREE TO START + clarifier">
        <HeroBottom freeStamp="FREE TO START" pricingLine={PRICING} />
      </Variant>
      <Variant label="G" note="Keep FREE, let the line carry the nuance">
        <HeroBottom freeStamp="FREE" pricingLine={PRICING} />
      </Variant>

      <SectionTitle>Popup on the stamp (hover to reveal the model)</SectionTitle>
      <p style={{ fontFamily: BODY, fontSize: '13px', color: '#6b7280', margin: '0 0 2px' }}>
        Stamp stays a single calm word; the freemium breakdown lives one hover (or keyboard focus)
        away. Hover the green chip to reveal the popover.
      </p>
      <Variant label="H" note="FREE + popup (hover the chip)">
        <div style={{ paddingTop: 96 }}>
          <HeroBottom freeStamp="FREE" popup />
        </div>
      </Variant>
      <Variant label="I" note="FREE TIER + popup (hover the chip)">
        <div style={{ paddingTop: 96 }}>
          <HeroBottom freeStamp="FREE TIER" popup />
        </div>
      </Variant>
    </div>
  </div>;

/* The honest model line as it would read in the ship/CLI frame (fuller copy). */
export const ShipFramePricingLine: Story = () => <div className="flex min-h-screen w-full items-center justify-center bg-white p-10" style={dotGrid}>
    <div className="w-full max-w-[560px] border-2 p-5" style={{ borderColor: ACID, background: '#f6ffe1' }}>
      <p style={{ fontFamily: BODY, fontSize: '13.5px', lineHeight: 1.5, color: '#374151', margin: 0 }}>
        <strong style={{ color: '#000' }}>200 selectors a month, free.</strong> Unlimited on any Intuned
        plan. Open source forever — the extension code lives on GitHub; the cloud that generates and
        certifies your selectors is Intuned.
      </p>
    </div>
  </div>;
