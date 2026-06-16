'use client';

import React, { useState } from 'react';
import * as HoverCard from '@radix-ui/react-hover-card';
import { ACID, INK, MONO, BODY, INTUNED_PRICING, TIER_BADGE } from '../shared/tokens';

/* ============================================================================
   FREE TIER STAMP — the hero's "FREE TIER" badge, upgraded to a chip that
   reveals the freemium model on hover/focus.

   Why a popover and not a plain "FREE" stamp: the extension is open source, but
   the Chrome build forges & certifies selectors in the Intuned cloud, which is
   metered (200/mo free, unlimited on a paid Intuned plan). A bare "FREE" stamp
   overclaims; this keeps the hero a single calm word while the honest detail is
   one hover away.

   Built on Radix HoverCard so focus management, hover/leave grace area (the gap
   between chip and card stays "open"), and collision-aware positioning are
   handled for us — and the card is portaled to <body>, so the column's
   `overflow-hidden` can't clip it. Touch has no hover, so MobileHero.tsx skips
   this and states the model as an inline line instead.
   ============================================================================ */
const FreeTierStamp: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <HoverCard.Root openDelay={80} closeDelay={80} onOpenChange={setOpen}>
      <HoverCard.Trigger asChild>
        <button
          type="button"
          className="inline-flex cursor-help items-center border-2"
          style={{
            borderColor: INK,
            background: ACID,
            color: '#000',
            padding: '4px 10px',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: TIER_BADGE.font,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: open ? '0 0 0 0 #000' : `${TIER_BADGE.shadow}px ${TIER_BADGE.shadow}px 0 0 ${INK}`,
            transform: open ? 'translate(2px,2px)' : 'translate(0,0)',
            transition: 'box-shadow 0.1s ease, transform 0.1s ease',
            borderRadius: 0,
          }}
        >
          Free Tier
          <span aria-hidden className="text-nano" style={{ marginLeft: 6, lineHeight: 1 }}>▾</span>
        </button>
      </HoverCard.Trigger>

      <HoverCard.Portal>
        <HoverCard.Content
          side="bottom"
          align="start"
          sideOffset={10}
          className="sf-tiercard relative z-50 flex flex-col"
          style={{
            width: 250,
            background: '#fff',
            border: `2px solid ${INK}`,
            boxShadow: '5px 5px 0 0 #000',
            padding: '11px 12px',
          }}
        >
          <span
            className="text-micro"
            style={{
              fontFamily: MONO,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#000',
              background: ACID,
              border: `2px solid ${INK}`,
              padding: '1px 6px',
              alignSelf: 'flex-start',
              marginBottom: 9,
            }}
          >
            HOW FREE WORKS
          </span>
          <span className="text-small" style={{ fontFamily: BODY, lineHeight: 1.45, color: '#111' }}>
            <strong>200 selectors / month</strong>, free — forever.
          </span>
          <span className="text-small" style={{ fontFamily: BODY, lineHeight: 1.45, color: '#111', marginTop: 4 }}>
            Need more? <strong>Unlimited</strong> on any{' '}
            <a
              href={INTUNED_PRICING}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#000', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2, textDecorationThickness: 2, textDecorationColor: ACID }}
            >
              paid Intuned plan
            </a>
            .
          </span>
          <span
            className="text-micro"
            style={{
              fontFamily: MONO,
              lineHeight: 1.4,
              color: '#6b7280',
              marginTop: 9,
              borderTop: '1px solid #e5e7eb',
              paddingTop: 8,
            }}
          >
            Extension is open source · selectors are forged &amp; certified in the Intuned cloud.
          </span>

          {/* brutalist caret pointing up at the chip, sitting in the offset gap */}
          <span
            aria-hidden
            style={{
              position: 'absolute',
              bottom: '100%',
              left: 18,
              width: 10,
              height: 10,
              background: '#fff',
              borderLeft: `2px solid ${INK}`,
              borderTop: `2px solid ${INK}`,
              transform: 'translateY(6px) rotate(45deg)',
            }}
          />
        </HoverCard.Content>
      </HoverCard.Portal>

      <style>{`
        @keyframes sfTierIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .sf-tiercard[data-state="open"] { animation: sfTierIn 0.12s ease; }
      `}</style>
    </HoverCard.Root>
  );
};

export { FreeTierStamp };
