import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ============================================================================
   selector-forge — "Forge — Browser · Annotated (orange)"
   LIGHT brutalist. Fixed left column (~38%, never scrolls). The right stage
   (~60%) is a LIGHT BROWSER WINDOW; the whole scroll story plays INSIDE its
   content viewport. One scroll progress P in [0,1] (rAF-throttled) drives the
   entire story as PURE functions of P — reversible scrubbing, transform/opacity
   only. No IntersectionObserver, no setTimeout sequencing.

   STORY:
     0.00–0.10  LOAD       — page sits in the browser.
     0.10–0.40  ELEMENT    — orange connector: dt "Solicitation Type" → dd.
     0.40–0.50  TOGGLE     — readout flips ELEMENT → LIST.
     0.50–0.70  LIST       — pick one file link → all 5 light, scoped by heading.
     0.70–0.84  DEPLOY     — page visibly re-renders; brittle jumps to the wrong
                            field (red), forged stays locked (orange).
     0.84–1.00  ENDING     — "Every selector, judged." + use-case cards + CTAs.
   ============================================================================ */

const ORANGE = '#FF7C37';
const INK = '#0B0B0B';
const RED = '#E5484D';
const MONO = "'Space Mono', monospace";
const HEAD = "'Bricolage Grotesque', sans-serif";
const BODY = "'Archivo', sans-serif";

/* ---------- math helpers (pure functions of P) ---------------------------- */
const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** local eased progress of window [a,b] given global p */
const seg = (p: number, a: number, b: number) => easeInOut(clamp((p - a) / (b - a)));
/** raw (un-eased) local progress */
const segLin = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
/** soft band: ramps in over `fade`, full inside, ramps out */
const band = (p: number, a: number, b: number, fade = 0.04) => {
  const inA = clamp((p - a) / fade);
  const outA = 1 - clamp((p - (b - fade)) / fade);
  return clamp(Math.min(inA, outA));
};

/* ============================================================================
   LEFT COLUMN — constant, never varies, never scrolls. Light, dot-grid.
   ============================================================================ */
const StampTag: React.FC<{
  label: string;
  bg: string;
  fg: string;
}> = ({
  label,
  bg,
  fg
}) => <span style={{
  display: 'inline-block',
  background: bg,
  color: fg,
  fontFamily: MONO,
  fontWeight: 700,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  padding: '5px 9px',
  border: '2px solid #000',
  boxShadow: '3px 3px 0 0 #000',
  borderRadius: 0,
  whiteSpace: 'nowrap'
}}>
  
    {label}
  </span>;
const LeftColumn: React.FC = () => {
  const [pressed, setPressed] = useState(false);
  return <aside className="shrink-0 flex flex-col justify-between overflow-hidden" style={{
    width: '38%',
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    background: '#ffffff',
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 1.6px)',
    backgroundSize: '18px 18px',
    backgroundPosition: '0 0',
    borderRight: '2px solid #000',
    boxSizing: 'border-box',
    padding: '36px 40px 24px',
    fontFamily: BODY,
    zIndex: 40
  }}>
      
      {/* wordmark: small orange square + black tag */}
      <div className="flex items-center" style={{
      gap: 8
    }}>
        <span aria-hidden style={{
        width: 8,
        height: 8,
        background: ORANGE,
        display: 'inline-block'
      }} />
        
        <span className="inline-block" style={{
        background: '#000',
        color: '#fff',
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 14,
        padding: '4px 8px',
        letterSpacing: '0.01em'
      }}>
          
          selector-forge
        </span>
      </div>

      {/* middle stack */}
      <div className="flex flex-col" style={{
      gap: 20
    }}>
        {/* headline */}
        <h1 style={{
        fontFamily: HEAD,
        fontWeight: 800,
        fontSize: 64,
        lineHeight: 0.95,
        letterSpacing: '-0.03em',
        color: '#000',
        margin: 0
      }}>
          
          <span className="block">Forged,</span>
          <span className="block">
            not{' '}
            <span style={{
            position: 'relative',
            display: 'inline-block'
          }}>
              <span style={{
              position: 'relative',
              zIndex: 1
            }}>copied</span>
              {/* CLEAN HORIZONTAL orange strikethrough — 0deg, crosses ONLY
                "copied" centered on the lowercase x-height MIDLINE. Sits at
                ~0.55em from the cap-top of this 64px Bricolage Grotesque line,
                which lands on the middle of the lowercase letters — not
                grazing their tops, not riding the baseline. Crosses only
                "copied"; stops flush at the final letter; never touches "not"
                or the period. */}
              <span aria-hidden style={{
              position: 'absolute',
              left: '-1%',
              right: '0%',
              top: '0.55em',
              height: 8,
              background: ORANGE,
              transform: 'translateY(-50%)',
              zIndex: 2,
              mixBlendMode: 'multiply',
              borderRadius: 1
            }} />
              
            </span>
            <span style={{
            position: 'relative',
            zIndex: 3
          }}>.</span>
          </span>
        </h1>

        {/* subline */}
        <p className="max-w-md" style={{
        fontFamily: BODY,
        fontWeight: 400,
        fontSize: 17,
        lineHeight: 1.5,
        color: '#1f2937',
        margin: 0
      }}>
          
          Every selector is generated, stress-tested against the page, and
          certified before you see it. The brittle ones never survive.
        </p>

        {/* CTA row */}
        <div className="flex flex-wrap items-center" style={{
        gap: 14,
        paddingTop: 2
      }}>
          <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} className="inline-flex items-center justify-center select-none" style={{
          background: '#000',
          color: '#fff',
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 15,
          padding: '13px 22px',
          textDecoration: 'none',
          border: '2px solid #000',
          boxShadow: pressed ? '0 0 0 0 ' + ORANGE : `6px 6px 0 0 ${ORANGE}`,
          transform: pressed ? 'translate(2px,2px)' : 'translate(0,0)',
          transition: 'box-shadow 0.08s ease, transform 0.08s ease',
          whiteSpace: 'nowrap'
        }}>
            
            Add to Chrome
          </a>
          <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" className="sf-ghost inline-flex items-center justify-center select-none" style={{
          background: '#fff',
          color: '#000',
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 15,
          padding: '11px 18px',
          textDecoration: 'none',
          border: '2px solid #000',
          transition: 'background 0.12s ease, color 0.12s ease',
          whiteSpace: 'nowrap'
        }}>
            
            View on GitHub →
          </a>
        </div>

        {/* stamped tags row */}
        <div className="flex flex-wrap items-center" style={{
        gap: 10,
        paddingTop: 2
      }}>
          <StampTag label="FREE" bg={ORANGE} fg="#000" />
          <span style={{
          color: '#9ca3af',
          fontWeight: 700
        }}>·</span>
          <StampTag label="OPEN SOURCE" bg="#fff" fg="#000" />
          <span style={{
          color: '#9ca3af',
          fontWeight: 700
        }}>·</span>
          <StampTag label="CHROME + FIREFOX" bg="#000" fg="#fff" />
        </div>
      </div>

      {/* footer */}
      <div>
        <span style={{
        fontFamily: BODY,
        fontSize: 12,
        color: '#9ca3af'
      }}>
          by Intuned
        </span>
      </div>

      <style>{`.sf-ghost:hover{background:#000 !important;color:#fff !important;}
        .sf-popcopy:hover{background:${ORANGE} !important;color:#000 !important;}`}</style>
    </aside>;
};

/* ============================================================================
   STORY DATA — verbatim selectors.
   ============================================================================ */
const URL_TEXT = 'acme-procure.gov/solicitations/RFP-2026-0142';
const ELEMENT_SELECTOR = "//dt[normalize-space()='Solicitation Type']/following-sibling::dd";
const LIST_SELECTOR = "//div[contains(@class, 'section') and .//h2[normalize-space()='Solicitation Files']]//a[contains(@href, '/files/')]";
const DETAIL_ROWS = [{
  term: 'Solicitation Type',
  value: 'Request for Proposal',
  anchor: true
}, {
  term: 'Status',
  value: 'Open',
  anchor: false
}, {
  term: 'Due Date',
  value: 'July 3, 2026',
  anchor: false
}];
const FILES = ['rfp-2026-0142-full-packet.pdf', 'attachment-A-scope-of-work.pdf', 'attachment-B-pricing-sheet.xlsx', 'addendum-01-qa-responses.pdf', 'pre-bid-conference-notes.pdf'];

/* ============================================================================
   EXTENSION POP-UP — the centerpiece. A compact Chrome-extension pop-up that
   DROPS from the orange toolbar button at the top-right of the chrome bar, with
   an upward caret pointing at that button. White, 2px black border, hard 4px
   shadow, sharp corners. WIDTH ~300px, height only as tall as its content.
   Floats over the top-RIGHT region only — never over the page's key content.

   Per-beat content:
     ELEMENT  → ELEMENT toggle active, element selector, reliability chip
     TOGGLE   → toggle slides ELEMENT → LIST
     LIST     → LIST toggle active, list selector, reliability chip
     DEPLOY   → "✓ still matches" (forged) vs "✗ brittle moved" readout
   ============================================================================ */
const POPUP_WIDTH = 300;
const ExtensionPopup: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // pop-up is ALWAYS docked at rest (empty state), then populates as the user
  // scrolls. `appear` must NOT gate visibility on P — the empty state has to be
  // fully on screen, docked under the toolbar button, at exactly P=0 (matching
  // the Panel/Judged siblings). So it is pinned to full opacity / settled
  // position; the empty→populated cross-fade is handled solely by `populate`.
  const appear = 1;
  // The body (toggle / selector / chip) reveals as the ELEMENT beat begins.
  const populate = seg(p, 0.06, 0.12);
  const empty = 1 - populate; // crosshair "Point at any element" empty state
  // toggle flips across 0.42–0.50
  const slide = seg(p, 0.42, 0.5);
  const elementActive = slide < 0.5;
  // which selector string to show (hard switch at mid-toggle, both verbatim)
  const showList = p >= 0.46;
  const selector = showList ? LIST_SELECTOR : ELEMENT_SELECTOR;
  // deploy readout band
  const deploy = seg(p, 0.7, 0.8);
  const deployBand = band(p, 0.7, 1.02, 0.03);
  // shrink the selector font a touch when it's the long LIST string
  const selFont = showList ? 9.5 : 11;
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try {
      navigator.clipboard?.writeText(selector);
    } catch {}
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1100);
  };
  return <div style={{
    position: 'absolute',
    top: 10,
    right: 12,
    width: POPUP_WIDTH,
    maxWidth: 320,
    background: '#ffffff',
    border: '2px solid #000',
    boxShadow: '4px 4px 0 0 #000',
    borderRadius: 0,
    zIndex: 35,
    opacity: appear,
    transform: `translateY(${lerp(-10, 0, appear)}px)`,
    transformOrigin: 'top right',
    willChange: 'transform, opacity',
    pointerEvents: 'auto'
  }}>

      {/* upward caret/notch pointing at the orange toolbar button */}
      <span aria-hidden style={{
      position: 'absolute',
      top: -9,
      right: 16,
      width: 14,
      height: 14,
      background: '#fff',
      borderLeft: '2px solid #000',
      borderTop: '2px solid #000',
      transform: 'rotate(45deg)'
    }} />

      {/* header row */}
      <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: '7px 9px',
      borderBottom: '2px solid #000',
      background: '#F2F2F2'
    }}>

        <span aria-hidden style={{
        width: 9,
        height: 9,
        background: ORANGE,
        border: '1.5px solid #000',
        display: 'inline-block',
        flexShrink: 0
      }} />
        <span style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 12,
        color: '#000',
        letterSpacing: '0.01em'
      }}>

          selector-forge
        </span>
        <span style={{
        marginLeft: 'auto',
        fontFamily: MONO,
        fontSize: 13,
        color: '#6b7280',
        lineHeight: 1
      }}>
          ×
        </span>
      </div>

      {/* EMPTY STATE — centered crosshair + "Point at any element". Shown at
        rest (P=0) so the resting frame clearly shows the extension docked.
        Cross-fades out as the body populates. */}
      {empty > 0.01 && <div style={{
      padding: '20px 14px 22px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      opacity: empty,
      // Once the live body starts to appear, lift the empty state OUT of flow
      // (absolute, overlaying the header-anchored body) so it never reserves
      // space or pushes the populated content down. At rest it sits in flow,
      // giving the pop-up its compact empty-state height.
      position: populate > 0.01 ? 'absolute' : 'relative',
      top: populate > 0.01 ? 0 : undefined,
      left: populate > 0.01 ? 0 : undefined,
      right: populate > 0.01 ? 0 : undefined,
      pointerEvents: 'none'
    }}>
          {/* crosshair glyph */}
          <span aria-hidden style={{
        position: 'relative',
        width: 26,
        height: 26,
        flexShrink: 0
      }}>
            <span style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 2,
          marginLeft: -1,
          background: ORANGE
        }} />
            <span style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          height: 2,
          marginTop: -1,
          background: ORANGE
        }} />
            <span style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          border: '2px solid #000',
          background: '#fff'
        }} />
          </span>
          <span style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 12,
        letterSpacing: '0.02em',
        color: '#000'
      }}>
            Point at any element
          </span>
          <span style={{
        fontFamily: MONO,
        fontSize: 9.5,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#9ca3af'
      }}>
            element · list · deploy-safe
          </span>
        </div>}

      {/* body — populates as you scroll past LOAD */}
      {populate > 0.01 && <div style={{
      padding: '9px 9px 10px',
      opacity: populate
    }}>

        {/* ELEMENT / LIST segmented toggle */}
        <div className="relative inline-flex" style={{
        border: '2px solid #000',
        background: '#fff',
        padding: 2,
        borderRadius: 0,
        marginBottom: 8,
        width: '100%'
      }}>

          <div aria-hidden style={{
          position: 'absolute',
          top: 2,
          bottom: 2,
          left: 2,
          width: 'calc(50% - 2px)',
          transform: `translateX(${slide * 100}%)`,
          background: ORANGE,
          border: '1.5px solid #000',
          willChange: 'transform'
        }} />

          {(['ELEMENT', 'LIST'] as const).map((lab, i) => {
          const active = i === 0 ? elementActive : !elementActive;
          return <span key={lab} style={{
            position: 'relative',
            zIndex: 1,
            flex: 1,
            textAlign: 'center',
            padding: '4px 0',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.08em',
            color: active ? '#000' : '#9ca3af',
            transition: 'color 0.2s ease'
          }}>

                {lab}
              </span>;
        })}
        </div>

        {/* selector label */}
        <span style={{
        display: 'block',
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 8.5,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: '#9ca3af',
        marginBottom: 4
      }}>

          selector
        </span>

        {/* selector value — verbatim, wraps on token boundaries to fit ~300px */}
        <code style={{
        display: 'block',
        fontFamily: MONO,
        fontWeight: 400,
        fontSize: selFont,
        lineHeight: 1.45,
        color: '#000',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        wordBreak: 'break-word',
        background: '#FFF4EE',
        border: `2px solid ${ORANGE}`,
        padding: '6px 7px',
        marginBottom: 9
      }} title={selector}>

          {selector}
        </code>

        {/* reliability chip + copy button */}
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }}>

          <span style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.02em',
          color: '#000',
          background: ORANGE,
          border: '2px solid #000',
          padding: '3px 7px',
          whiteSpace: 'nowrap'
        }}>

            reliability: high
          </span>
          <button onClick={copy} className="sf-popcopy" style={{
          marginLeft: 'auto',
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.04em',
          color: '#fff',
          background: '#000',
          border: '2px solid #000',
          padding: '4px 10px',
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}>

            {copied ? '✓ copied' : 'copy'}
          </button>
        </div>

        {/* DEPLOY readout — forged still matches vs brittle moved */}
        {deployBand > 0.01 && <div style={{
        marginTop: 9,
        paddingTop: 9,
        borderTop: '2px dashed #000',
        opacity: deployBand,
        display: 'flex',
        flexDirection: 'column',
        gap: 5
      }}>

            <span style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 8.5,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#9ca3af'
        }}>

              after deploy
            </span>
            <span style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 11,
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}>

              <span style={{
            color: ORANGE
          }}>✓</span> forged — still matches
            </span>
            <span style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 11,
          color: RED,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          opacity: clamp(deploy + 0.15)
        }}>

              <span>✗</span> brittle — moved off target
            </span>
          </div>}
      </div>}
    </div>;
};

/* ============================================================================
   GOV PAGE — believable procurement page inside the browser viewport.
   Receives P so it can (a) host the ELEMENT/LIST annotations, and (b) visibly
   MUTATE during the deploy window (classes shuffle, banner slides, layout
   shifts). Everything is a pure function of P.
   ============================================================================ */
const GovPage: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // ELEMENT highlight band
  const elHi = band(p, 0.12, 0.46, 0.04);
  // LIST highlight band
  const listHi = band(p, 0.5, 0.84, 0.04);
  // deploy band
  const deploy = seg(p, 0.7, 0.8);
  const deployBand = band(p, 0.7, 0.86, 0.03);

  // class-name noise shown during/after deploy
  const showNoise = deployBand;

  // the ELEMENT anchor connector (dt -> dd) progress
  const connectorDraw = seg(p, 0.16, 0.3);

  // LIST: pick-one then ignite all five
  const pickOne = seg(p, 0.52, 0.58);
  const igniteStart = 0.58;
  const igniteEnd = 0.68;
  const itemIgnite = (i: number) => {
    const per = (igniteEnd - igniteStart) / FILES.length;
    const start = igniteStart + i * per;
    return seg(p, start, start + per + 0.015);
  };
  // list connectors to the heading
  const listConnect = band(p, 0.6, 0.84, 0.04);

  // refs for measuring connector geometry
  const pageRef = useRef<HTMLDivElement>(null);
  const dtRef = useRef<HTMLSpanElement>(null);
  const ddRef = useRef<HTMLSpanElement>(null);
  const filesHeadingRef = useRef<HTMLHeadingElement>(null);
  const fileRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // measured geometry (in page-local px)
  const [geom, setGeom] = useState({
    dt: {
      x: 0,
      y: 0
    },
    dd: {
      x: 0,
      y: 0
    },
    heading: {
      x: 0,
      y: 0
    },
    files: [] as Array<{
      x: number;
      y: number;
    }>
  });
  const measure = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    const pr = page.getBoundingClientRect();
    const center = (el: Element | null, side: 'left' | 'right' = 'right') => {
      if (!el) return {
        x: 0,
        y: 0
      };
      const r = el.getBoundingClientRect();
      return {
        x: (side === 'right' ? r.right : r.left) - pr.left,
        y: r.top + r.height / 2 - pr.top
      };
    };
    setGeom({
      dt: center(dtRef.current, 'right'),
      dd: center(ddRef.current, 'left'),
      heading: center(filesHeadingRef.current, 'left'),
      files: fileRefs.current.map(el => center(el, 'left'))
    });
  }, []);
  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    const t = setTimeout(measure, 120);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [measure]);
  // re-measure when the deploy shift changes layout meaningfully
  useEffect(() => {
    measure();
  }, [measure, deploy]);
  const sysFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
  return <div ref={pageRef} style={{
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    background: '#ffffff',
    fontFamily: sysFont
  }}>
      
      {/* ---- "Site updated" deploy banner (slides in) ---- */}
      <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      background: '#fff7ed',
      borderBottom: `2px solid ${ORANGE}`,
      padding: '7px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      transform: `translateY(${lerp(-100, 0, deploy)}%)`,
      opacity: deployBand,
      zIndex: 6,
      willChange: 'transform, opacity'
    }}>
        
        <span style={{
        width: 8,
        height: 8,
        background: ORANGE,
        display: 'inline-block',
        border: '1px solid #000'
      }} />
        
        <span style={{
        fontFamily: MONO,
        fontWeight: 700,
        fontSize: 11,
        color: '#000',
        letterSpacing: '0.02em'
      }}>
          
          Site updated — new template deployed
        </span>
        <span style={{
        marginLeft: 'auto',
        fontFamily: MONO,
        fontSize: 10,
        color: '#9a6a4a'
      }}>
          
          v2.0
        </span>
      </div>

      {/* ---- scrollable-looking page body (shifts down on deploy) ----
        The body header/breadcrumb span full width, but the KEY content
        (title, dl rows, file list) is constrained to the LEFT ~58% via a
        right padding equal to the pop-up footprint so nothing important
        ever sits under the floating pop-up at top-right. */}
      <div style={{
      padding: '0 0 18px',
      transform: `translateY(${lerp(0, 8, deploy)}px)`,
      willChange: 'transform'
    }}>

        {/* gov header bar */}
        <div style={{
        background: deploy > 0.5 ? '#10243f' : '#13294b',
        color: '#fff',
        padding: deploy > 0.5 ? '13px 18px' : '11px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        transition: 'none'
      }}>
          
          <span style={{
          width: 18,
          height: 18,
          background: ORANGE,
          display: 'inline-block'
        }} />
          
          <span style={{
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '0.01em'
        }}>
            ACME County · Office of Procurement
          </span>
          <span style={{
          marginLeft: 'auto',
          fontSize: 12,
          opacity: 0.8
        }}>
            {deploy > 0.5 ? 'Portal 2.0' : 'eProcurement Portal'}
          </span>
        </div>

        {/* breadcrumb */}
        <div style={{
        padding: '8px 18px',
        fontSize: 12,
        color: '#5b6470',
        background: '#f6f7f9',
        borderBottom: '1px solid #e3e6ea'
      }}>
          
          Home <span style={{
          color: '#aeb4bc'
        }}>/</span> Solicitations{' '}
          <span style={{
          color: '#aeb4bc'
        }}>/</span>{' '}
          <span style={{
          color: '#13294b',
          fontWeight: 600
        }}>RFP-2026-0142</span>
        </div>

        {/* title — constrained to the LEFT lane so it never sits under the
          top-right pop-up. */}
        <div style={{
        padding: '16px 18px 4px',
        width: '60%',
        boxSizing: 'border-box'
      }}>
          <h1 style={{
          fontFamily: sysFont,
          fontSize: 21,
          fontWeight: 700,
          color: '#1b2330',
          margin: 0,
          lineHeight: 1.2
        }}>

            RFP-2026-0142 — Roadway Maintenance Services
          </h1>
        </div>

        {/* ---- Solicitation Details (the dl) — LEFT lane ---- */}
        <div className="sol-section" style={{
        padding: '12px 18px 8px',
        width: '60%',
        boxSizing: 'border-box'
      }}>
          
          <h2 style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#7a828d',
          margin: '0 0 8px'
        }}>
            
            Solicitation Details
          </h2>
          <dl style={{
          margin: 0,
          border: '1px solid #e3e6ea',
          borderRadius: 0,
          overflow: 'hidden'
        }}>
            
            {DETAIL_ROWS.map((r, i) => {
            const isAnchor = r.anchor;
            const lit = isAnchor ? elHi : 0;
            return <div key={r.term} style={{
              display: 'grid',
              gridTemplateColumns: '180px 1fr',
              borderBottom: i < DETAIL_ROWS.length - 1 ? '1px solid #e3e6ea' : 'none',
              background: i % 2 === 0 ? '#fafbfc' : '#fff'
            }}>
                  
                  <dt style={{
                padding: '9px 12px',
                fontSize: 13,
                color: '#5b6470',
                fontWeight: 600,
                borderRight: '1px solid #e3e6ea',
                position: 'relative'
              }}>
                    
                    {/* anchor outline on the dt label */}
                    {isAnchor && <span aria-hidden style={{
                  position: 'absolute',
                  inset: 3,
                  border: `2px solid ${ORANGE}`,
                  opacity: lit,
                  pointerEvents: 'none'
                }} />}
                    <span ref={isAnchor ? dtRef : undefined} style={{
                  position: 'relative'
                }}>
                      
                      {r.term}
                    </span>
                  </dt>
                  <dd style={{
                margin: 0,
                padding: '9px 12px',
                fontSize: 13,
                color: '#1b2330',
                position: 'relative'
              }}>
                    
                    {/* orange fill highlight on the target dd */}
                    {isAnchor && <span aria-hidden style={{
                  position: 'absolute',
                  inset: 3,
                  background: ORANGE,
                  opacity: lit * 0.85,
                  transform: `scaleX(${lerp(0.7, 1, lit)})`,
                  transformOrigin: 'left center',
                  pointerEvents: 'none'
                }} />}
                    <span ref={isAnchor ? ddRef : undefined} style={{
                  position: 'relative',
                  fontWeight: isAnchor && lit > 0.3 ? 700 : 400
                }}>
                      
                      {r.value}
                    </span>
                    {/* deploy class-noise suffix */}
                    {showNoise > 0.01 && <span style={{
                  marginLeft: 8,
                  fontFamily: MONO,
                  fontSize: 9,
                  color: '#b9bec6',
                  opacity: showNoise
                }}>
                      
                        .{isAnchor ? 'fld-7c2e' : 'cell-' + (i + 4).toString(16)}
                      </span>}
                  </dd>
                </div>;
          })}
          </dl>
        </div>

        {/* ---- Solicitation Files — LEFT lane ---- */}
        <div className="files-section" style={{
        padding: '10px 18px 8px',
        width: '60%',
        boxSizing: 'border-box'
      }}>
          
          <h2 ref={filesHeadingRef} style={{
          fontSize: 13,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: '#7a828d',
          margin: '0 0 8px',
          display: 'inline-block',
          position: 'relative'
        }}>
            
            Solicitation Files
            {/* heading anchor outline during LIST */}
            <span aria-hidden style={{
            position: 'absolute',
            inset: '-2px -4px',
            border: `2px solid ${ORANGE}`,
            opacity: listConnect,
            pointerEvents: 'none'
          }} />
            
          </h2>
          <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0
        }}>
            {FILES.map((f, i) => {
            const lit = Math.max(itemIgnite(i), i === 0 ? pickOne * (1 - seg(p, 0.66, 0.7)) : 0);
            const litC = clamp(lit) * listHi;
            return <li key={f} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 8px',
              borderBottom: '1px solid #eef0f2',
              position: 'relative'
            }}>
                  
                  {/* orange row highlight */}
                  <span aria-hidden style={{
                position: 'absolute',
                inset: 2,
                border: `2px solid ${ORANGE}`,
                background: 'rgba(255,124,55,0.12)',
                opacity: litC,
                transform: `scaleX(${lerp(0.7, 1, litC)})`,
                transformOrigin: 'left center',
                pointerEvents: 'none'
              }} />
                  
                  {/* file icon */}
                  <span style={{
                width: 14,
                height: 16,
                background: litC > 0.3 ? ORANGE : '#cfd4da',
                display: 'inline-block',
                flexShrink: 0,
                position: 'relative',
                zIndex: 1
              }} />
                  
                  <a ref={el => {
                fileRefs.current[i] = el;
              }} href={`/files/${f}`} onClick={e => e.preventDefault()} style={{
                position: 'relative',
                zIndex: 1,
                fontFamily: sysFont,
                fontSize: 13,
                color: '#1d4ed8',
                textDecoration: 'underline',
                fontWeight: litC > 0.4 ? 600 : 400
              }}>
                    
                    {f}
                  </a>
                  <span style={{
                marginLeft: 'auto',
                position: 'relative',
                zIndex: 1,
                fontFamily: MONO,
                fontSize: 11,
                fontWeight: 700,
                color: ORANGE,
                opacity: litC
              }}>
                    
                    ✓
                  </span>
                </li>;
          })}
          </ul>
        </div>
      </div>

      {/* ============================================================
        ANNOTATION OVERLAY — SVG connectors. Sits above page.
        ============================================================ */}
      <AnnotationOverlay geom={geom} connectorDraw={connectorDraw} elHi={elHi} listConnect={listConnect} />
      

      {/* DEPLOY markers measured against the dd rows (red jumps, orange locked) */}
      <DeployMarkers p={p} ddTop={geom.dd.y} />
    </div>;
};

/* ---- annotation overlay (anchor + list connectors) ---- */
const AnnotationOverlay: React.FC<{
  geom: {
    dt: {
      x: number;
      y: number;
    };
    dd: {
      x: number;
      y: number;
    };
    heading: {
      x: number;
      y: number;
    };
    files: Array<{
      x: number;
      y: number;
    }>;
  };
  connectorDraw: number;
  elHi: number;
  listConnect: number;
}> = ({
  geom,
  connectorDraw,
  elHi,
  listConnect
}) => {
  const {
    dt,
    dd,
    heading,
    files
  } = geom;

  // ELEMENT connector: a bold orange line dt.right -> dd.left, with a small
  // downward bow so it reads as a deliberate "tie".
  const elValid = elHi > 0.01 && dt.x > 0 && dd.x > 0;
  // mid control point for a gentle arc
  const mx = (dt.x + dd.x) / 2;
  const my = Math.max(dt.y, dd.y) + 14;
  const elPath = `M ${dt.x + 4} ${dt.y} Q ${mx} ${my} ${dd.x - 4} ${dd.y}`;
  return <svg width="100%" height="100%" style={{
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 8,
    overflow: 'visible'
  }}>
      
      <defs>
        <marker id="forge-arrow-orange" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          
          <path d="M 0 0 L 10 5 L 0 10 z" fill={ORANGE} />
        </marker>
        <marker id="forge-arrow-red" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          
          <path d="M 0 0 L 10 5 L 0 10 z" fill={RED} />
        </marker>
      </defs>

      {/* ELEMENT anchor→label connector (the HERO) */}
      {elValid && <g style={{
      opacity: elHi
    }}>
          {/* white halo under the line for legibility */}
          <path d={elPath} fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - connectorDraw} />
        
          <path d={elPath} fill="none" stroke={ORANGE} strokeWidth={3} strokeLinecap="round" markerEnd="url(#forge-arrow-orange)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - connectorDraw} />
        
          {/* dot at the dt anchor */}
          <circle cx={dt.x + 4} cy={dt.y} r={4} fill={ORANGE} stroke="#000" strokeWidth={1.5} />
        
        </g>}

      {/* LIST connectors: each file → "Solicitation Files" heading */}
      {listConnect > 0.01 && heading.x > 0 && files.map((f, i) => {
      if (f.x <= 0) return null;
      const cmx = (heading.x + f.x) / 2 - 18;
      const cmy = (heading.y + f.y) / 2;
      const d = `M ${heading.x - 4} ${heading.y} Q ${cmx} ${cmy} ${f.x - 4} ${f.y}`;
      return <path key={i} d={d} fill="none" stroke={ORANGE} strokeWidth={1.5} strokeLinecap="round" opacity={listConnect * 0.6} strokeDasharray="3 3" />;
    })}
    </svg>;
};

/* ---- on-page chips (HTML, not SVG, for crisp brutalist look) ---- */
const PageChips: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const elChip = band(p, 0.24, 0.46, 0.04);
  const listChip = band(p, 0.62, 0.84, 0.04);
  const deployChip = band(p, 0.74, 1.02, 0.03);
  const deploy = seg(p, 0.7, 0.8);
  // All on-page chips live in the LEFT lane (near the content they annotate)
  // so none of them ever sit under the floating pop-up at top-right.
  return <>
      {/* ELEMENT chip — sits below the anchored dl row, LEFT lane */}
      <Chip opacity={elChip} style={{
      top: 196,
      left: 18
    }} bg={ORANGE} text="#000">

        anchored to the label
      </Chip>

      {/* LIST chip — sits beside the file list, LEFT lane */}
      <Chip opacity={listChip} style={{
      top: 290,
      left: 18
    }} bg={ORANGE} text="#000">

        scoped by heading · any count
      </Chip>

      {/* DEPLOY: brittle wrong (red) + forged locked (orange) — both LEFT lane,
       stacked so neither reaches the top-right pop-up */}
      <Chip opacity={deployChip * clamp(deploy)} style={{
      top: 122,
      left: 18
    }} bg="#fff" text={RED} border={RED}>

        ✕ brittle → wrong field
      </Chip>
      <Chip opacity={deployChip * clamp(deploy)} style={{
      top: 158,
      left: 18
    }} bg={ORANGE} text="#000">

        ✓ forged → still locked
      </Chip>
    </>;
};
const Chip: React.FC<{
  children: React.ReactNode;
  opacity: number;
  style: React.CSSProperties;
  bg: string;
  text: string;
  border?: string;
}> = ({
  children,
  opacity,
  style,
  bg,
  text,
  border = '#000'
}) => {
  if (opacity <= 0.001) return null;
  return <span style={{
    position: 'absolute',
    zIndex: 12,
    background: bg,
    color: text,
    border: `2px solid ${border}`,
    boxShadow: `3px 3px 0 0 ${border}`,
    padding: '4px 9px',
    fontFamily: MONO,
    fontWeight: 700,
    fontSize: 11,
    letterSpacing: '0.01em',
    whiteSpace: 'nowrap',
    opacity,
    transform: `translateY(${lerp(6, 0, opacity)}px)`,
    willChange: 'transform, opacity',
    ...style
  }}>
      
      {children}
    </span>;
};

/* ============================================================================
   DEPLOY MARKERS — red outline that JUMPS to the WRONG field, orange outline
   that stays locked on the right one. Rendered as page-positioned boxes that
   are pure fns of P, layered above the dl rows.
   These live inside the GovPage coordinate space via absolute positioning at
   known row offsets (approximate but visually clear).
   ============================================================================ */
const DeployMarkers: React.FC<{
  p: number;
  ddTop: number;
}> = ({
  p,
  ddTop
}) => {
  const deploy = seg(p, 0.7, 0.8);
  const vis = band(p, 0.7, 1.02, 0.03);
  if (vis <= 0.001 || ddTop <= 0) return null;

  // ddTop is the measured vertical center of the anchored value row.
  // Rows are ~35px tall. Forged (orange) stays on row 0; brittle (red) JUMPS
  // from row 0 down two rows (to "Due Date") after the deploy.
  const rowH = 35;
  const forgedCenter = ddTop;
  const brittleCenter = lerp(ddTop, ddTop + rowH * 2, easeInOut(deploy));
  const valueLeft = 200; // start x of the value column inside content
  const valueWidth = 168;
  const boxH = 22;
  return <div style={{
    position: 'absolute',
    inset: 0,
    zIndex: 11,
    pointerEvents: 'none'
  }}>
      {/* forged — locked orange box on the correct value */}
      <div style={{
      position: 'absolute',
      left: valueLeft,
      top: forgedCenter - boxH / 2,
      width: valueWidth,
      height: boxH,
      border: `2px solid ${ORANGE}`,
      boxShadow: `0 0 0 2px rgba(255,124,55,0.25)`,
      opacity: vis
    }} />
      
      {/* brittle — red box that drifts to the wrong row */}
      <div style={{
      position: 'absolute',
      left: valueLeft + 4,
      top: brittleCenter - boxH / 2,
      width: valueWidth - 8,
      height: boxH,
      border: `2px dashed ${RED}`,
      opacity: vis * clamp(deploy + 0.15),
      willChange: 'top'
    }} />
      
    </div>;
};

/* ============================================================================
   CAPTION — eyebrow (Space Mono uppercase, tracking-wide) + one plain line.
   Sits ABOVE the readout bar, inside the viewport, flips by phase.
   ============================================================================ */
const PHASE_COPY: Array<{
  a: number;
  b: number;
  eyebrow: string;
  line: string;
}> = [{
  a: -0.02,
  b: 0.1,
  eyebrow: 'SEE IT ON THE PAGE',
  line: 'A real procurement page, loaded in your browser.'
}, {
  a: 0.1,
  b: 0.4,
  eyebrow: 'ELEMENT',
  line: 'Forge ties the selector to the label beside it.'
}, {
  a: 0.4,
  b: 0.5,
  eyebrow: 'SWITCH MODE',
  line: 'Same page — now grab a whole list instead.'
}, {
  a: 0.5,
  b: 0.7,
  eyebrow: 'LIST',
  line: 'Pick one file link and Forge scopes to all of them.'
}, {
  a: 0.7,
  b: 0.84,
  eyebrow: 'AFTER A DEPLOY',
  line: 'The brittle one now grabs the wrong field. The forged one doesn’t move.'
}, {
  a: 0.84,
  b: 1.02,
  eyebrow: 'JUDGED',
  line: 'Every selector, certified before you ever see it.'
}];
const PhaseCaption: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const hint = clamp((0.02 - p) / 0.02);
  return <div style={{
    position: 'absolute',
    inset: 0,
    paddingTop: 8,
    zIndex: 25,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'flex-start',
    // LEFT: eyebrow + line stacked. RIGHT: scroll ↓ hint. The gap guarantees
    // they never overlap each other or the caption text.
    justifyContent: 'space-between',
    gap: 16
  }}>

      {/* LEFT lane — eyebrow pill stacked above one plain-language line.
        Phases cross-fade in the SAME slot so no two pills ever stack. */}
      <div style={{
      position: 'relative',
      flex: '1 1 auto',
      minWidth: 0,
      height: '100%'
    }}>
        {PHASE_COPY.map(c => {
        const o = band(p, c.a, c.b, 0.03);
        if (o <= 0.001) return null;
        return <div key={c.eyebrow} style={{
          position: 'absolute',
          left: 0,
          top: 0,
          right: 0,
          opacity: o,
          transform: `translateY(${lerp(6, 0, o)}px)`,
          willChange: 'transform, opacity'
        }}>

              <span style={{
            display: 'inline-block',
            background: '#000',
            color: ORANGE,
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            padding: '3px 8px',
            marginBottom: 6
          }}>

                {c.eyebrow}
              </span>
              <p style={{
            margin: 0,
            fontFamily: BODY,
            fontWeight: 500,
            fontSize: 14,
            color: '#1b2330',
            display: 'block',
            maxWidth: '100%',
            lineHeight: 1.3
          }}>

                {c.line}
              </p>
            </div>;
      })}
      </div>

      {/* RIGHT lane — scroll ↓ hint, reserved its own column so it never sits
        on top of the eyebrow pill or the caption line. */}
      {hint > 0.001 && <span style={{
      flexShrink: 0,
      alignSelf: 'flex-start',
      marginTop: 4,
      opacity: hint,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 10,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#000',
      whiteSpace: 'nowrap'
    }}>
          scroll{' '}
          <span style={{
        display: 'inline-block',
        animation: 'forgeScrollBounce 1.2s ease-in-out infinite'
      }}>
            ↓
          </span>
        </span>}
    </div>;
};

/* ============================================================================
   ENDING OVERLAY — covers the viewport at the end. "Every selector, judged."
   + two dark use-case code cards + CTAs + CLI coming-soon + email capture.
   ============================================================================ */
const EndingOverlay: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const vis = band(p, 0.84, 1.05, 0.03);
  const rise = seg(p, 0.85, 0.95);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [pressed, setPressed] = useState(false);
  if (vis <= 0.001) return null;
  return <div style={{
    position: 'absolute',
    inset: 0,
    background: '#ffffff',
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 1.6px)',
    backgroundSize: '18px 18px',
    zIndex: 40,
    opacity: vis,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '28px 34px 56px',
    pointerEvents: vis > 0.6 ? 'auto' : 'none'
  }}>
      
      <div style={{
      transform: `translateY(${lerp(18, 0, rise)}px)`,
      willChange: 'transform',
      maxWidth: 620,
      margin: '0 auto',
      width: '100%'
    }}>
        
        {/* headline */}
        <h2 style={{
        fontFamily: HEAD,
        fontWeight: 800,
        fontSize: 40,
        lineHeight: 1.0,
        letterSpacing: '-0.03em',
        color: '#000',
        margin: '0 0 18px'
      }}>
          
          Every selector,{' '}
          <span style={{
          position: 'relative',
          display: 'inline-block'
        }}>
            <span style={{
            position: 'relative',
            zIndex: 1
          }}>judged.</span>
            <span aria-hidden style={{
            position: 'absolute',
            left: '-1%',
            right: '-1%',
            bottom: '8%',
            height: 9,
            background: ORANGE,
            zIndex: 0
          }} />
            
          </span>
        </h2>

        {/* two use-case cards */}
        <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        marginBottom: 18
      }}>
          
          {/* PLAYWRIGHT TEST */}
          <UseCaseCard index="01" title="PLAYWRIGHT TEST">
            <div style={{
            fontFamily: MONO,
            fontSize: 11.5,
            lineHeight: 1.55,
            color: '#e5e7eb'
          }}>
              
              <span style={{
              color: '#6b7280'
            }}>await </span>
              <span style={{
              color: '#fff'
            }}>page.</span>
              <span style={{
              color: ORANGE
            }}>locator</span>
              <span style={{
              color: '#fff'
            }}>(</span>
              <span style={{
              color: '#9be3ff',
              overflowWrap: 'anywhere'
            }}>
                "xpath=//dt[…]/…::dd"
              </span>
              <span style={{
              color: '#fff'
            }}>)</span>
              <span style={{
              color: '#fff'
            }}>.</span>
              <span style={{
              color: ORANGE
            }}>textContent</span>
              <span style={{
              color: '#fff'
            }}>()</span>
            </div>
            <div style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
              <span style={{
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 10.5,
              color: '#065f46',
              background: '#a7f3d0',
              border: '2px solid #065f46',
              padding: '3px 7px',
              boxShadow: '3px 3px 0 0 #065f46'
            }}>
                
                ✓ PASS
              </span>
              <span style={{
              fontFamily: BODY,
              fontSize: 12,
              color: '#9aa1ab'
            }}>
                1 passed (0.4s)
              </span>
            </div>
          </UseCaseCard>

          {/* SCRAPER */}
          <UseCaseCard index="02" title="SCRAPER">
            <pre style={{
            fontFamily: MONO,
            fontSize: 12,
            lineHeight: 1.55,
            color: '#e5e7eb',
            margin: 0,
            whiteSpace: 'pre-wrap'
          }}>
              
              <span style={{
              color: '#6b7280'
            }}>{'{'}</span>
              {'\n  '}
              <span style={{
              color: ORANGE
            }}>"solicitationType"</span>
              <span style={{
              color: '#fff'
            }}>: </span>
              <span style={{
              color: '#9be3ff'
            }}>"Request for Proposal"</span>
              {'\n'}
              <span style={{
              color: '#6b7280'
            }}>{'}'}</span>
            </pre>
            <div style={{
            marginTop: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: BODY,
            fontSize: 12,
            color: '#9aa1ab'
          }}>
              
              <span style={{
              width: 8,
              height: 8,
              background: ORANGE,
              border: '1.5px solid #fff',
              display: 'inline-block'
            }} />
              
              anchored — the right field, every time
            </div>
          </UseCaseCard>
        </div>

        {/* CTA row */}
        <div className="flex flex-wrap items-center" style={{
        gap: 12,
        marginBottom: 16
      }}>
          <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} className="inline-flex items-center justify-center select-none" style={{
          background: '#000',
          color: '#fff',
          fontFamily: BODY,
          fontWeight: 700,
          fontSize: 15,
          padding: '12px 22px',
          textDecoration: 'none',
          border: '2px solid #000',
          boxShadow: pressed ? '0 0 0 0 ' + ORANGE : `6px 6px 0 0 ${ORANGE}`,
          transform: pressed ? 'translate(2px,2px)' : 'translate(0,0)',
          transition: 'box-shadow 0.08s ease, transform 0.08s ease',
          whiteSpace: 'nowrap'
        }}>
            
            Add to Chrome
          </a>
          <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" className="sf-ghost2 inline-flex items-center justify-center select-none" style={{
          background: '#fff',
          color: '#000',
          fontFamily: BODY,
          fontWeight: 600,
          fontSize: 15,
          padding: '10px 18px',
          textDecoration: 'none',
          border: '2px solid #000',
          transition: 'background 0.12s ease, color 0.12s ease',
          whiteSpace: 'nowrap'
        }}>
            
            View on GitHub →
          </a>
        </div>

        {/* CLI — COMING SOON */}
        <div style={{
        border: `2px solid ${ORANGE}`,
        background: '#fff7ef',
        padding: '12px 14px'
      }}>
          
          <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 9
        }}>
            <span style={{
            width: 8,
            height: 8,
            borderRadius: 8,
            background: ORANGE,
            display: 'inline-block',
            animation: 'forgeCaret 1.2s steps(1) infinite'
          }} />
            
            <span style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#9a4a1a',
            background: ORANGE,
            padding: '2px 7px',
            border: '2px solid #000'
          }}>
              
              CLI — COMING SOON
            </span>
            <span style={{
            fontFamily: BODY,
            fontSize: 12.5,
            color: '#374151'
          }}>
              Drive it from your terminal:{' '}
              <code style={{
              fontFamily: MONO,
              fontWeight: 700,
              color: '#000'
            }}>
                npx selector-forge pick
              </code>
            </span>
          </div>

          {/* email capture */}
          <form onSubmit={e => {
          e.preventDefault();
          if (email.trim()) setSent(true);
        }} className="flex flex-wrap items-center" style={{
          gap: 12
        }}>
            
            {!sent ? <div className="flex items-stretch" style={{
            border: '2px solid #000',
            background: '#fff',
            boxShadow: '3px 3px 0 0 #000'
          }}>
              
                <input type="email" required value={email} onChange={e => {
              setEmail(e.target.value);
              setSent(false);
            }} placeholder="you@work.com" aria-label="email for CLI launch notification" style={{
              width: 190,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '8px 10px',
              fontFamily: MONO,
              fontSize: 12,
              color: '#000'
            }} />
              
                <button type="submit" className="sf-notify" style={{
              borderLeft: '2px solid #000',
              background: '#000',
              color: '#fff',
              padding: '8px 14px',
              fontFamily: MONO,
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
                
                  GET NOTIFIED
                </button>
              </div> : <div style={{
            border: `2px solid ${ORANGE}`,
            background: '#fff',
            boxShadow: '3px 3px 0 0 #000',
            padding: '8px 12px',
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 12,
            color: '#000'
          }}>
              
                ✓ you're on the list
              </div>}
            <a href="https://github.com/Intuned/selector-forge#readme" target="_blank" rel="noreferrer" className="sf-blog2" style={{
            fontFamily: MONO,
            fontWeight: 700,
            fontSize: 12,
            color: '#000',
            textDecoration: 'underline',
            textUnderlineOffset: 3
          }}>
              
              Why Static Selectors Fail →
            </a>
          </form>
        </div>
      </div>

      <style>{`
        .sf-ghost2:hover{background:#000 !important;color:#fff !important;}
        .sf-notify:hover{background:${ORANGE} !important;color:#000 !important;}
        .sf-blog2:hover{color:${ORANGE} !important;}
      `}</style>
    </div>;
};
const UseCaseCard: React.FC<{
  index: string;
  title: string;
  children: React.ReactNode;
}> = ({
  index,
  title,
  children
}) => <div style={{
  border: '2px solid #000',
  background: '#0B0B0B',
  boxShadow: `6px 6px 0 0 ${ORANGE}`,
  padding: '12px 14px'
}}>
  
    <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  }}>
      <span style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 10,
      color: '#000',
      background: ORANGE,
      padding: '2px 6px'
    }}>
      
        {index}
      </span>
      <span style={{
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 11,
      letterSpacing: '0.1em',
      color: '#fff'
    }}>
      
        {title}
      </span>
    </div>
    {children}
  </div>;

/* ============================================================================
   PROGRESS RAIL — thin, inset ~16px from the right edge, never clipping.
   ============================================================================ */
const RAIL_TICKS: Array<{
  p: number;
  label: string;
}> = [{
  p: 0.0,
  label: 'LOAD'
}, {
  p: 0.1,
  label: 'ELEMENT'
}, {
  p: 0.4,
  label: 'TOGGLE'
}, {
  p: 0.5,
  label: 'LIST'
}, {
  p: 0.7,
  label: 'DEPLOY'
}, {
  p: 0.84,
  label: 'JUDGED'
}];
const ProgressRail: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // The rail lives in the CLEAR band of the right gutter (between the window's
  // shadow at ~96px from the stage edge and the stage edge itself), vertically
  // centered. The rail line sits at right:26 and its labels extend LEFT into the
  // clear band, stopping well before the window's shadow — labels never touch
  // or cross the window's black border.
  return <div style={{
    position: 'absolute',
    right: 26,
    top: '22%',
    bottom: '22%',
    width: 2,
    zIndex: 50
  }}>
      
      <div style={{
      position: 'absolute',
      inset: 0,
      background: '#d4d4d4'
    }} />
      <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      width: 2,
      height: `${clamp(p) * 100}%`,
      background: ORANGE,
      willChange: 'height'
    }} />
      
      {RAIL_TICKS.map(t => {
      const passed = p >= t.p - 0.001;
      return <div key={t.label} style={{
        position: 'absolute',
        right: 6,
        top: `${t.p * 100}%`,
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }}>
            
            <span style={{
          fontFamily: MONO,
          fontWeight: 700,
          fontSize: 8.5,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: passed ? '#000' : '#bdbdbd',
          background: passed ? ORANGE : 'transparent',
          padding: passed ? '1px 4px' : '1px 0',
          whiteSpace: 'nowrap'
        }}>

              {t.label}
            </span>
            <span style={{
          width: 6,
          height: 2,
          background: passed ? '#000' : '#bdbdbd',
          display: 'inline-block'
        }} />

          </div>;
    })}
    </div>;
};

/* ============================================================================
   BROWSER WINDOW — the LIGHT chrome that wraps the whole story.
   Exported so a Ladle story can render the browser on its own (no left
   manifesto column / rail / caption band), driven by a single `p` in [0,1].
   ============================================================================ */
export const BrowserWindow: React.FC<{
  p: number;
}> = ({
  p
}) => {
  return <div style={{
    width: '100%',
    height: '100%',
    background: '#fff',
    border: '2px solid #000',
    boxShadow: '8px 8px 0 0 #000',
    borderRadius: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
    boxSizing: 'border-box'
  }}>
      
      {/* chrome bar */}
      <div style={{
      height: 44,
      flexShrink: 0,
      background: '#F2F2F2',
      borderBottom: '2px solid #000',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 12px'
    }}>
        
        {/* macOS dots */}
        <span style={{
        display: 'flex',
        gap: 7
      }}>
          <span style={{
          width: 11,
          height: 11,
          borderRadius: 11,
          background: '#FF5F56',
          border: '1px solid rgba(0,0,0,0.2)'
        }} />
          <span style={{
          width: 11,
          height: 11,
          borderRadius: 11,
          background: '#FFBD2E',
          border: '1px solid rgba(0,0,0,0.2)'
        }} />
          <span style={{
          width: 11,
          height: 11,
          borderRadius: 11,
          background: '#27C93F',
          border: '1px solid rgba(0,0,0,0.2)'
        }} />
        </span>

        {/* omnibox */}
        <div style={{
        flex: 1,
        background: '#fff',
        border: '2px solid #000',
        padding: '5px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        minWidth: 0
      }}>
          
          <span style={{
          width: 9,
          height: 9,
          borderRadius: 9,
          border: '1.5px solid #6b7280',
          display: 'inline-block',
          flexShrink: 0
        }} />
          <span style={{
          fontFamily: MONO,
          fontSize: 12,
          color: '#374151',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
            
            {URL_TEXT}
          </span>
        </div>

        {/* selector-forge toolbar button (orange square) */}
        <span style={{
        width: 22,
        height: 22,
        background: ORANGE,
        border: '2px solid #000',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }} title="selector-forge">
          
          <span style={{
          width: 8,
          height: 8,
          background: '#000',
          display: 'inline-block'
        }} />
        </span>
      </div>

      {/* CONTENT VIEWPORT — the story plays here, clipped.
        GovPage hosts the page + measured connectors + DeployMarkers.
        The floating ExtensionPopup drops from the orange toolbar button and
        floats over the top-right region only. PhaseCaption now lives in the
        caption band BELOW the window (see RightStage), not in here. */}
      <div style={{
      position: 'relative',
      flex: 1,
      overflow: 'hidden',
      background: '#fff'
    }}>
        <GovPage p={p} />
        <PageChips p={p} />
        <ExtensionPopup p={p} />
        <EndingOverlay p={p} />
      </div>
    </div>;
};

/* ============================================================================
   RIGHT STAGE — sticky inside a tall scroll track. Single P drives everything.
   ============================================================================ */
// Right lane that holds the progress rail. The window carries an 8px hard
// offset shadow, so the gutter must absorb that shadow PLUS leave a real clear
// band for the rail. With RAIL_GUTTER = 104, the window border sits 104px from
// the stage's right edge and its shadow's right edge sits 104 − 8 = 96px from it,
// leaving a fully clear ≥60px band in which the rail (and its labels) lives,
// never touching the window's black border.
const RAIL_GUTTER = 104;
const CAPTION_BAND = 64; // bottom strip that holds the per-beat caption
const RightStage: React.FC<{
  p: number;
}> = ({
  p
}) => {
  return <div style={{
    position: 'relative',
    width: '100%',
    height: '100%',
    background: '#ffffff',
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 1.6px)',
    backgroundSize: '18px 18px',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }}>

      {/* The stage is split into THREE clean lanes via an inset content box:
         1) BROWSER WINDOW — fills the box minus the right rail gutter and
            minus the bottom caption band.
         2) PROGRESS RAIL  — lives in the right gutter, fully inset 16px from
            the stage's right edge, vertically centered, never clipped.
         3) CAPTION BAND   — the ~64px strip BELOW the window. */}
      <div style={{
      position: 'absolute',
      inset: 0,
      padding: '40px 0 36px 40px',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'stretch'
    }}>

        {/* LANE 1 + 3 — window stacked above the caption band */}
        <div style={{
        flex: 1,
        minWidth: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        // reserve the rail gutter on the right so the window border never
        // reaches the gutter / canvas right edge
        paddingRight: RAIL_GUTTER,
        boxSizing: 'border-box'
      }}>

          {/* LANE 1 — BROWSER WINDOW */}
          <div style={{
          flex: 1,
          minHeight: 0,
          width: '100%'
        }}>
            <BrowserWindow p={p} />
          </div>

          {/* LANE 3 — CAPTION BAND (full window width, below the window) */}
          <div style={{
          height: CAPTION_BAND,
          flexShrink: 0,
          width: '100%',
          position: 'relative'
        }}>
            <PhaseCaption p={p} />
          </div>
        </div>
      </div>

      {/* LANE 2 — PROGRESS RAIL in the right gutter, inset 16px, centered */}
      <ProgressRail p={p} />
    </div>;
};

/* ============================================================================
   ROOT — fixed left light column + right scroll track with sticky stage.
   ============================================================================ */
export const ForgeBrowserAnnotatedOrange: React.FC = () => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const compute = useCallback(() => {
    const el = scrollRef.current;
    const track = trackRef.current;
    if (!el || !track) return;
    const max = track.offsetHeight - el.clientHeight;
    const next = max > 0 ? clamp(el.scrollTop / max) : 0;
    targetRef.current = next;
  }, []);
  const onScroll = useCallback(() => {
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      compute();
      setP(targetRef.current);
    });
  }, [compute]);
  useEffect(() => {
    compute();
    setP(targetRef.current);
    const onResize = () => {
      compute();
      setP(targetRef.current);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [compute]);
  return <div className="w-full flex" style={{
    height: '100vh',
    background: '#fff',
    fontFamily: BODY,
    overflow: 'hidden'
  }}>
      
      <LeftColumn />

      {/* RIGHT — scroll track with sticky stage. marginLeft reserves the left column. */}
      <div ref={scrollRef} onScroll={onScroll} className="relative" style={{
      marginLeft: '38%',
      width: '62%',
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'thin'
    }}>
        
        <div ref={trackRef} style={{
        height: '480vh',
        position: 'relative'
      }}>
          <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%'
        }}>
            <RightStage p={p} />
          </div>
        </div>
      </div>
    </div>;
};
export default ForgeBrowserAnnotatedOrange;