'use client';

import React from 'react';
import { ACID, INK, MONO, BODY, SEL_ELEMENT, SEL_LIST } from '../../shared/tokens';
import { ForgeMark } from '../ForgeLogo';

/* ============================================================================
   MOBILE FRAMES — simplified, static retellings of the three desktop beats
   (PICK → LIST → SHIP). These do NOT reuse the desktop browser mock + cursor;
   that choreography doesn't read at phone width. Each frame is a self-contained
   brutalist card sized for a narrow column: index + eyebrow, a compact visual,
   and a one-line caption. Acid #C8FF2E is the only accent.
   ============================================================================ */

export const FrameShell: React.FC<{
  index: string;
  eyebrow: string;
  caption: string;
  children: React.ReactNode;
}> = ({ index, eyebrow, caption, children }) => (
  <section
    className="bg-white"
    style={{ border: `2px solid ${INK}`, boxShadow: `6px 6px 0 0 ${INK}` }}
  >
    {/* header strip */}
    <div
      className="flex items-center gap-2"
      style={{ borderBottom: `2px solid ${INK}`, padding: '8px 12px' }}
    >
      <span
        className="text-badge"
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          color: '#000',
          background: ACID,
          border: `2px solid ${INK}`,
          padding: '1px 6px',
        }}
      >
        {index}
      </span>
      <span
        className="text-badge"
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: INK,
        }}
      >
        {eyebrow}
      </span>
    </div>

    {/* visual */}
    <div style={{ padding: 14 }}>{children}</div>

    {/* caption */}
    <div style={{ borderTop: `2px solid ${INK}`, padding: '10px 12px' }}>
      <p className="text-body" style={{ margin: 0, fontFamily: BODY, lineHeight: 1.45, color: '#1f2937' }}>
        {caption}
      </p>
    </div>
  </section>
);

/* ---------- shared browser-chrome primitives ------------------------------ */

/* a little black arrow cursor */
const Cursor: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <svg width="18" height="20" viewBox="0 0 18 20" style={{ filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.25))', ...style }}>
    <path d="M2 1 L2 16 L6 12.5 L8.5 18 L11 17 L8.5 11.5 L14 11 Z" fill="#fff" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

/* the acid extension toolbar button */
const ExtIcon: React.FC<{ size?: number; pressed?: boolean }> = ({ size = 24, pressed }) => (
  <span
    style={{
      width: size,
      height: size,
      flexShrink: 0,
      background: ACID,
      border: `2px solid ${INK}`,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: pressed ? 'scale(0.88)' : 'scale(1)',
      boxShadow: pressed ? `0 0 0 3px color-mix(in srgb, ${ACID} 60%, transparent)` : 'none',
    }}
  >
    <ForgeMark fill={INK} aria-hidden style={{ width: size * 0.64, height: 'auto', display: 'block' }} />
  </span>
);

/* a simplified browser chrome bar; `pressed` highlights the extension icon */
const ChromeBar: React.FC<{ url?: string; pressed?: boolean }> = ({
  url = 'bidportal.example/opp/RFP-2026-0142',
  pressed,
}) => (
  <div
    className="flex items-center gap-2"
    style={{ height: 34, padding: '0 8px', background: '#F2F2F2', borderBottom: `2px solid ${INK}` }}
  >
    <span style={{ display: 'flex', gap: 5 }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 9, height: 9, borderRadius: 9, background: i === 2 ? ACID : '#fff', border: `1.5px solid ${INK}` }} />
      ))}
    </span>
    <div
      style={{
        flex: 1,
        minWidth: 0,
        height: 22,
        background: '#fff',
        border: `2px solid ${INK}`,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '0 8px',
      }}
    >
      <svg width="9" height="10" viewBox="0 0 10 11" style={{ flexShrink: 0 }}>
        <rect x="1" y="4.6" width="8" height="6" fill={INK} />
        <path d="M2.6 4.6 V3.1 a2.4 2.4 0 0 1 4.8 0 V4.6" fill="none" stroke={INK} strokeWidth="1.2" />
      </svg>
      <span className="text-badge" style={{ fontFamily: MONO, color: '#374151', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {url}
      </span>
    </div>
    <ExtIcon pressed={pressed} />
  </div>
);

/* ---------- 01 · PICK — extension popup drops from the toolbar icon -------- */
export const PickFrame: React.FC = () => (
  <FrameShell
    index="01"
    eyebrow="Pick any element"
    caption="A Chrome & Firefox extension: open the popup, hit Pick element, then click any value."
  >
    <div style={{ border: `2px solid ${INK}`, position: 'relative' }}>
      <ChromeBar pressed />
      {/* popup dropping from the extension icon (top-right) */}
      <div style={{ position: 'relative', background: '#fff', padding: '14px 10px 12px', minHeight: 96 }}>
        <span
          aria-hidden
          style={{ position: 'absolute', top: -7, right: 12, width: 12, height: 12, background: '#fff', borderTop: `2px solid ${INK}`, borderLeft: `2px solid ${INK}`, transform: 'rotate(45deg)' }}
        />
        <div style={{ border: `2px solid ${INK}`, background: '#fff', boxShadow: `4px 4px 0 0 ${INK}`, padding: 10, marginLeft: 'auto', width: 210 }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 9 }}>
            <span className="text-badge" style={{ fontFamily: MONO, fontWeight: 700, color: INK }}>selector-forge</span>
          </div>
          <button
            className="text-label"
            style={{
              width: '100%',
              background: ACID,
              border: `2px solid ${INK}`,
              boxShadow: `3px 3px 0 0 ${INK}`,
              padding: '8px 10px',
              fontFamily: MONO,
              fontWeight: 700,
              color: INK,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <span className="text-small">⌖</span> Pick element
          </button>
          <div className="text-badge" style={{ marginTop: 7, fontFamily: BODY, color: '#6b7280', textAlign: 'center' }}>
            then click any value on the page
          </div>
          <Cursor style={{ position: 'absolute', right: 18, bottom: 26 }} />
        </div>
      </div>
    </div>
  </FrameShell>
);

/* the forged result: a prominent "FORGE GENERATES ↓" hand-off into an
   acid-headed RESULT SELECTOR card, so it clearly reads as the output. */
const ResultSelector: React.FC<{ selector: string }> = ({ selector }) => (
  <div style={{ marginTop: 12 }}>
    <div className="flex items-center gap-2" style={{ paddingLeft: 6, marginBottom: 8 }}>
      <span className="text-body" style={{ fontFamily: MONO, color: INK, lineHeight: 1 }}>└▶</span>
      <span
        className="text-micro"
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#000',
          background: ACID,
          border: `2px solid ${INK}`,
          boxShadow: `2px 2px 0 0 ${INK}`,
          padding: '3px 8px',
        }}
      >
        FORGE GENERATES
      </span>
    </div>
    <div style={{ border: `2px solid ${INK}`, background: INK, boxShadow: `5px 5px 0 0 ${ACID}` }}>
      <div
        className="text-nano"
        style={{
          fontFamily: MONO,
          fontWeight: 700,
          letterSpacing: '0.14em',
          color: '#000',
          background: ACID,
          padding: '4px 9px',
          borderBottom: `2px solid ${INK}`,
        }}
      >
        RESULT SELECTOR
      </div>
      <div style={{ padding: '10px 10px' }}>
        <div className="text-badge" style={{ fontFamily: MONO, lineHeight: 1.55, color: '#9be3ff', wordBreak: 'break-all' }}>
          {selector}
        </div>
        <div style={{ marginTop: 10 }}>
          <span className="text-micro" style={{ fontFamily: MONO, fontWeight: 700, color: '#000', background: ACID, padding: '2px 7px' }}>
            ✓ JUDGED · RELIABLE
          </span>
        </div>
      </div>
    </div>
  </div>
);

/* ---------- 02 · ELEMENT — the click, and the selector it forges ---------- */
export const ElementFrame: React.FC = () => (
  <FrameShell
    index="02"
    eyebrow="Anchored to the label"
    caption="Click a value and forge ties the selector to its label — never its position."
  >
    {/* browser window: the live page being inspected */}
    <div style={{ border: `2px solid ${INK}` }}>
      <ChromeBar pressed />
      <div style={{ background: '#fafafa', padding: 10 }}>
        {[
          ['Agency', 'Dept. of General Services', false],
          ['Solicitation Type', 'Request for Proposal', true],
          ['Status', 'Open — accepting bids', false],
        ].map(([l, v, t]) => (
          <div
            key={l as string}
            className="relative flex items-center justify-between"
            style={{
              padding: '8px 9px',
              marginTop: l === 'Agency' ? 0 : 4,
              background: t ? `color-mix(in srgb, ${ACID} 22%, transparent)` : 'transparent',
              outline: t ? `2px solid ${INK}` : 'none',
            }}
          >
            <span className="text-label" style={{ fontFamily: BODY, color: '#6b7280' }}>{l as string}</span>
            <span className="text-label" style={{ fontFamily: BODY, fontWeight: t ? 700 : 500, color: INK }}>{v as string}</span>
            {t && (
              <>
                {/* devtools-style inspect tag */}
                <span className="text-nano" style={{ position: 'absolute', left: -2, top: -15, fontFamily: MONO, fontWeight: 700, color: '#000', background: ACID, border: `1.5px solid ${INK}`, padding: '1px 4px', whiteSpace: 'nowrap' }}>
                  dd · the value
                </span>
                <Cursor style={{ position: 'absolute', right: -4, bottom: -10, zIndex: 2 }} />
              </>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* the generated, certified selector */}
    <ResultSelector selector={SEL_ELEMENT} />
  </FrameShell>
);

/* ---------- 03 · LIST ------------------------------------------------------ */
export const ListFrame: React.FC = () => {
  const files = [
    'RFP-2026-0142-full-packet.pdf',
    'attachment-A-scope-of-work.pdf',
    'attachment-B-pricing-sheet.xlsx',
    'addendum-01-qa-responses.pdf',
    'vendor-conference-slides.pdf',
  ];
  return (
    <FrameShell
      index="03"
      eyebrow="Or the whole list"
      caption="Pick one file — get every file on the page, any count."
    >
      <div style={{ border: `2px solid ${INK}` }}>
        <ChromeBar url="bidportal.example/opp/RFP-2026-0142#files" pressed />
        <div
          className="text-badge"
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            letterSpacing: '0.08em',
            color: INK,
            padding: '7px 10px',
            borderBottom: `2px solid ${INK}`,
            background: '#fff',
          }}
        >
          SOLICITATION FILES
        </div>
        {files.map((f, i) => (
          <div
            key={f}
            className="flex items-center gap-2"
            style={{
              padding: '8px 10px',
              borderTop: i === 0 ? 'none' : `1px solid #e5e7eb`,
              borderLeft: `4px solid ${ACID}`,
              background: `color-mix(in srgb, ${ACID} 10%, transparent)`,
            }}
          >
            <span
              className="text-nano"
              style={{
                width: 14,
                height: 14,
                flexShrink: 0,
                background: ACID,
                border: `2px solid ${INK}`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: MONO,
                fontWeight: 700,
                color: '#000',
                lineHeight: 1,
              }}
            >
              ✓
            </span>
            <span
              className="text-badge"
              style={{
                fontFamily: MONO,
                color: INK,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {f}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <span
          className="text-badge"
          style={{
            fontFamily: MONO,
            fontWeight: 700,
            color: '#000',
            background: ACID,
            border: `2px solid ${INK}`,
            padding: '3px 7px',
            boxShadow: `3px 3px 0 0 ${INK}`,
          }}
        >
          5 FILES · 1 SELECTOR
        </span>
      </div>

      {/* the one selector that captures every file */}
      <ResultSelector selector={SEL_LIST} />
    </FrameShell>
  );
};
