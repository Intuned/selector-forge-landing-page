'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ACID, INK, MONO, BODY, SEL_ELEMENT, SEL_LIST, TIER_CONTROL } from '../../shared/tokens';
import { clamp, segLin, band } from '../../shared/math';
import { LIST_A, LIST_B, CHROME_H, W_TARGET } from '../../shared/constants';
import { FILES } from '../../shared/data';

/* ============================================================================
   EXTENSION POPUP — drops from the toolbar icon. Three states keyed to P:
     CHOICE     (single / list + "Pick element")  — before the page click
     SELECTING  (crosshair + "Point at any element / hover the page")
     JUDGED     (typed selector + RELIABLE)        — after the page click
   ============================================================================ */
const ModeRow: React.FC<{
  active: boolean;
  title: string;
  desc: string;
}> = ({
  active,
  title,
  desc
}) => <div className="flex items-start gap-2 border-2 px-2 py-1.5" style={{
  borderColor: active ? INK : '#d6d6d6',
  background: active ? `color-mix(in srgb, ${ACID} 18%, transparent)` : '#fff',
  boxShadow: active ? `3px 3px 0 0 ${INK}` : 'none'
}}>
    <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center" style={{
    border: `2px solid ${INK}`,
    background: '#fff',
    borderRadius: 999
  }}>
      <span style={{
      width: 6,
      height: 6,
      borderRadius: 999,
      background: active ? INK : 'transparent'
    }} />
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="text-label" style={{
      fontFamily: MONO,
      fontWeight: 700,
      color: INK,
      lineHeight: 1.25
    }}>{title}</span>
      <span className="text-badge" style={{
      fontFamily: BODY,
      fontWeight: 400,
      color: '#5f6368',
      lineHeight: 1.3
    }}>{desc}</span>
    </span>
  </div>;

/* the centered crosshair mark used in the SELECTING state (mirrors the on-page
   picker so the popup and the page tell the same "you're selecting" story) */
const PopupCrosshair: React.FC = () => <span aria-hidden style={{
  position: 'relative',
  width: 32,
  height: 32,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center'
}}>
    <span style={{
    position: 'absolute',
    inset: 0,
    border: `2px solid ${INK}`,
    animation: 'forgeCrosshairPulse 1.4s ease-in-out infinite'
  }} />
    <span style={{
    position: 'absolute',
    left: '50%',
    top: -5,
    bottom: -5,
    width: 2,
    background: ACID,
    transform: 'translateX(-50%)'
  }} />
    <span style={{
    position: 'absolute',
    top: '50%',
    left: -5,
    right: -5,
    height: 2,
    background: ACID,
    transform: 'translateY(-50%)'
  }} />
    <span style={{
    position: 'relative',
    width: 7,
    height: 7,
    background: '#fff',
    border: `2px solid ${INK}`,
    zIndex: 1
  }} />
  </span>;
const ForgePopup: React.FC<{
  p: number;
  isList: boolean;
  pickRef: React.RefObject<HTMLButtonElement | null>;
}> = ({
  p,
  isList,
  pickRef
}) => {
  // CHOICE (windows overlap their neighbours so the popup body never blanks)
  const choiceSingle = band(p, 0.1, 0.218, 0.022);
  const choiceList = band(p, LIST_A - 0.03, LIST_A + 0.05, 0.02);
  const showChoice = Math.max(choiceSingle, choiceList);
  const isListChoice = choiceList > choiceSingle;

  // SELECTING (element only — between the "Pick element" click and the page click)
  const selSingle = band(p, 0.206, W_TARGET + 0.022, 0.02);
  const showSelecting = selSingle;
  const isListSel = false;

  // JUDGED
  const judgedEl = band(p, W_TARGET + 0.004, LIST_A - 0.03, 0.02);
  const judgedList = band(p, LIST_A + 0.06, LIST_B + 0.04, 0.03);
  const showJudged = Math.max(judgedEl, judgedList);
  const sel = isList ? SEL_LIST : SEL_ELEMENT;
  const sub = isList ? 'any count' : 'anchored to label';
  const elTyped = segLin(p, W_TARGET + 0.02, 0.4);
  const listTyped = segLin(p, LIST_A + 0.06, LIST_A + 0.16);
  const typed = clamp(isList ? listTyped : elTyped);
  const shown = sel.slice(0, Math.round(typed * sel.length));
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);
  const timer = useRef<number | null>(null);
  const doCopy = useCallback(() => {
    try {
      navigator.clipboard?.writeText(sel);
    } catch {}
    setCopied(true);
    if (timer.current != null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1500);
  }, [sel]);
  useEffect(() => () => {
    if (timer.current != null) window.clearTimeout(timer.current);
  }, []);

  // The three state panels are absolutely stacked; the body height follows a
  // show-weighted blend of their measured heights, so it EASES between states
  // instead of snapping to the tall CHOICE panel when it reappears at the LIST
  // beat. (Was: whichever state dominated became `relative` and drove height,
  // which jumped.)
  const choiceR = useRef<HTMLDivElement>(null);
  const selR = useRef<HTMLDivElement>(null);
  const judgedR = useRef<HTMLDivElement>(null);
  const [bodyH, setBodyH] = useState<number | null>(null);
  useEffect(() => {
    const hC = choiceR.current?.offsetHeight ?? 0;
    const hS = selR.current?.offsetHeight ?? 0;
    const hJ = judgedR.current?.offsetHeight ?? 0;
    const wsum = showChoice + showSelecting + showJudged;
    const target = wsum > 0 ? (showChoice * hC + showSelecting * hS + showJudged * hJ) / wsum : hJ;
    const h = Math.round(target);
    if (h > 0) setBodyH(prev => prev === h ? prev : h);
  }, [showChoice, showSelecting, showJudged, typed, isList]);
  const panelStyle = (vis: number): React.CSSProperties => ({
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    opacity: vis,
    pointerEvents: vis > 0.5 ? 'auto' : 'none'
  });
  const selecting = isListSel ? {
    title: 'Pick a few items',
    sub: 'we generalize the selector to the whole set'
  } : {
    title: 'Point at any element',
    sub: 'hover the page · forge judges it live'
  };
  return <div className="relative flex w-full flex-col bg-white" style={{
    border: `2px solid ${INK}`,
    boxShadow: `6px 6px 0 0 ${INK}`,
    borderRadius: 0
  }}>
      <div className="flex items-center gap-2 border-b-2 px-2.5 py-2" style={{
      borderColor: INK
    }}>
        <span className="shrink-0 text-label" style={{
        fontFamily: MONO,
        fontWeight: 700,
        color: INK,
        letterSpacing: '0.01em'
      }}>selector-forge</span>
        <div className="flex-1" />
        <span aria-hidden className="text-small" style={{
        fontFamily: MONO,
        fontWeight: 700,
        color: INK,
        lineHeight: 1
      }}>×</span>
      </div>

      <div className="relative" style={{
      height: bodyH ?? undefined,
      transition: 'height 160ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
        {/* CHOICE */}
        <div ref={choiceR} style={panelStyle(showChoice)}>
          <div className="px-2.5 pb-2.5 pt-2.5">
            <div className="mb-2 text-micro" style={{
            fontFamily: MONO,
            fontWeight: 700,
            color: INK,
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>New selector</div>
            <ModeRow active={!isListChoice} title="Single element" desc="Target one element on the page." />
            <div className="h-2" />
            <ModeRow active={isListChoice} title="List of items" desc="Pick a few repeated items, get one selector for all." />
            <button ref={pickRef} type="button" className="mt-3 inline-flex w-full items-center justify-center border-2 px-3 py-2 transition-transform duration-150 active:translate-x-[4px] active:translate-y-[4px]" style={{
            borderColor: INK,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: TIER_CONTROL.font,
            color: INK,
            background: ACID,
            boxShadow: `${TIER_CONTROL.shadow}px ${TIER_CONTROL.shadow}px 0 0 ${INK}`,
            letterSpacing: '0.02em'
          }}>
              Pick element
            </button>
          </div>
        </div>

        {/* SELECTING */}
        <div ref={selR} style={panelStyle(showSelecting)}>
          <div className="flex flex-col items-center justify-center gap-2.5" style={{
          padding: '22px 16px 22px'
        }}>
            <PopupCrosshair />
            <span className="text-label" style={{
            fontFamily: MONO,
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: INK,
            textAlign: 'center'
          }}>{selecting.title}</span>
            <span className="text-nano" style={{
            fontFamily: MONO,
            letterSpacing: '0.03em',
            color: '#9ca3af',
            textAlign: 'center'
          }}>{selecting.sub}</span>
          </div>
        </div>

        {/* JUDGED */}
        <div ref={judgedR} style={panelStyle(showJudged)}>
          <div className="px-2.5 pb-2.5 pt-2.5">
            {/* selector shown in a dark card so it reads as the forged result
               (mirrors the mobile RESULT SELECTOR treatment). */}
            <code className="text-label" style={{
            fontFamily: MONO,
            fontWeight: 400,
            lineHeight: 1.5,
            color: '#9be3ff',
            background: INK,
            border: `2px solid ${INK}`,
            padding: '8px 10px',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            display: 'block',
            minHeight: 34
          }}>
              {shown}
              <span aria-hidden style={{
              display: 'inline-block',
              width: 6,
              height: 12,
              marginLeft: 1,
              transform: 'translateY(2px)',
              background: ACID,
              opacity: typed < 1 ? 1 : 0,
              animation: 'forgeCaretBlink 0.9s steps(1) infinite'
            }} />
            </code>
            <div className="mt-2.5 flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center text-micro" style={{
                background: ACID,
                border: `1.5px solid ${INK}`,
                color: INK,
                fontFamily: MONO,
                fontWeight: 700,
                lineHeight: 1
              }}>✓</span>
                <span className="text-badge" style={{
                fontFamily: MONO,
                fontWeight: 700,
                color: INK,
                letterSpacing: '0.02em'
              }}>RELIABLE</span>
                <span className="text-nano" style={{
                fontFamily: MONO,
                fontWeight: 700,
                color: '#9ca3af'
              }}>{sub}</span>
              </span>
              <button type="button" onClick={doCopy} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="inline-flex shrink-0 items-center justify-center gap-1 border-2 px-2.5 py-1.5 transition-transform duration-150 active:translate-x-[2px] active:translate-y-[2px]" style={{
              borderColor: INK,
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: TIER_CONTROL.font,
              background: hover && !copied ? ACID : INK,
              color: hover && !copied ? INK : '#fff',
              boxShadow: `${TIER_CONTROL.shadow}px ${TIER_CONTROL.shadow}px 0 0 ${ACID}`,
              whiteSpace: 'nowrap'
            }}>
                {copied ? '✓ copied' : 'copy selector'}
              </button>
            </div>

            <div style={{
            marginTop: 10,
            borderTop: `2px solid ${INK}`,
            paddingTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 7
          }}>
              <span className="text-nano" style={{
              fontFamily: MONO,
              fontWeight: 700,
              color: '#54616f',
              textTransform: 'uppercase',
              letterSpacing: '0.08em'
            }}>
                {isList ? `${FILES.length} matches` : 'matches'}
              </span>
              <span className="text-nano" style={{
              marginLeft: 'auto',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: MONO,
              fontWeight: 700,
              color: '#000'
            }}>
                <span aria-hidden style={{
                width: 8,
                height: 8,
                background: ACID,
                border: '1.5px solid #000',
                display: 'inline-block'
              }} />
                {isList ? 'whole set' : 'this page'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};

/* The popup drops from the extension icon at the top-right of the chrome bar.
   Always mounted (so the "Pick element" button is measurable) but opacity 0 and
   non-interactive until it is "opened" by the icon click (present gate). */
const FloatingForge: React.FC<{
  p: number;
  isList: boolean;
  pickRef: React.RefObject<HTMLButtonElement | null>;
}> = ({
  p,
  isList,
  pickRef
}) => {
  const present = clamp((p - 0.1) / 0.035);
  return <div className="absolute z-30" style={{
    top: CHROME_H + 6,
    right: 12,
    width: 300,
    opacity: present,
    pointerEvents: present > 0.5 ? 'auto' : 'none',
    transform: `translateY(${(1 - present) * -8}px)`,
    transformOrigin: 'top right'
  }}>
      <span aria-hidden className="absolute" style={{
      right: 8,
      top: -9,
      width: 16,
      height: 16,
      background: '#fff',
      borderTop: `2px solid ${INK}`,
      borderLeft: `2px solid ${INK}`,
      transform: 'rotate(45deg)',
      zIndex: 2
    }} />
      <ForgePopup p={p} isList={isList} pickRef={pickRef} />
    </div>;
};

export { FloatingForge };
