import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ============================================================================
   Forge — Browser Picker (Element & List)
   Left column = FIXED. Right stage = scroll TRACK (~480vh) + STICKY browser.
   One progress P in [0,1] drives EVERYTHING as pure functions of P.
   ========================================================================== */

const ACID = '#C8FF2E';
const BLACK = '#0B0B0B';
const RED = '#E5484D';

/* ---- easing + helpers ---------------------------------------------------- */
const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
// Smooth window: ramps 0->1 over [a,b] with easeInOut.
const ramp = (p: number, a: number, b: number) => easeInOut(clamp((p - a) / (b - a)));
// Bump: 0 -> 1 -> 0 across [a, peak, b]
const bump = (p: number, a: number, peak: number, b: number) => {
  if (p < a || p > b) return 0;
  if (p < peak) return easeInOut((p - a) / (peak - a));
  return easeInOut(1 - (p - peak) / (b - peak));
};
// Active-in-phase weight: 1 inside [a,b] with ~0.03 fade edges
const phaseWeight = (p: number, a: number, b: number, fade = 0.03) => {
  const inU = easeInOut(clamp((p - a) / fade));
  const outU = 1 - easeInOut(clamp((p - b) / fade));
  return clamp(Math.min(inU, outU));
};

/* ===========================================================================
   ROOT
   ========================================================================== */
export const ForgeBrowserPickerElementList: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = trackRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = clamp(-rect.top / (total || 1));
        setP(scrolled);
      });
    };
    const scroller = document.querySelector('#root') || window;
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    document.addEventListener('scroll', onScroll, {
      passive: true,
      capture: true
    });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scroll', onScroll, true as any);
      if (raf) cancelAnimationFrame(raf);
      void scroller;
    };
  }, []);
  return <div className="relative w-full bg-white" style={{
    fontFamily: "'Archivo', sans-serif",
    color: BLACK
  }}>
      
      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* LEFT — fixed column */}
        <LeftColumn />
        {/* RIGHT — scroll track with sticky browser stage */}
        <div className="relative" style={{
        width: '60%'
      }}>
          <div ref={trackRef} style={{
          height: '480vh'
        }}>
            <div className="sticky top-0 h-screen w-full overflow-hidden">
              <RightStage p={p} />
            </div>
          </div>
        </div>
      </div>
    </div>;
};

/* ===========================================================================
   LEFT COLUMN — fixed, identical across variants
   ========================================================================== */
export const LeftColumn: React.FC = () => {
  return <aside className="sticky top-0 flex h-screen flex-col justify-between border-r-2 px-9 py-8" style={{
    width: '40%',
    borderColor: BLACK,
    backgroundColor: '#fff',
    backgroundImage: `radial-gradient(${BLACK} 1.1px, transparent 1.1px)`,
    backgroundSize: '18px 18px',
    backgroundPosition: '-2px -2px'
    // dot grid at ~3% opacity via overlay trick below
  }}>
      
      {/* faint dot grid overlay to hit ~3% opacity */}
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{
      backgroundColor: 'rgba(255,255,255,0.97)'
    }} />
      
      <div className="relative z-10 flex flex-col gap-6">
        {/* wordmark */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-1 text-white" style={{
          backgroundColor: BLACK,
          fontFamily: "'Space Mono', monospace",
          fontWeight: 700,
          fontSize: 14,
          letterSpacing: '-0.01em'
        }}>
            
            selector-forge
          </span>
        </div>

        {/* headline */}
        <h1 className="font-heading" style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 800,
        fontSize: 72,
        lineHeight: 0.95,
        letterSpacing: '-0.02em',
        margin: 0
      }}>
          
          <span className="block">Forged,</span>
          <span className="block">
            not{' '}
            <span className="relative inline-block">
              <span className="relative z-10">copied</span>
              {/* CLEAN HORIZONTAL acid strike — spans ONLY the glyphs of "copied"
                 (begins at 'c', ends at 'd'); never crosses the period or whitespace */}
              <span aria-hidden className="absolute z-20" style={{
              left: 0,
              right: 0,
              top: '52%',
              height: 11,
              transform: 'translateY(-50%)',
              backgroundColor: ACID
            }} />
              
            </span>
            <span className="relative z-10">.</span>
          </span>
        </h1>

        {/* subline */}
        <p className="max-w-md" style={{
        fontFamily: "'Archivo', sans-serif",
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
        <div className="flex flex-wrap items-center gap-4 pt-1">
          <AddToChrome />
          <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" className="inline-flex items-center px-5 py-3 transition-transform" style={{
          border: `2px solid ${BLACK}`,
          backgroundColor: '#fff',
          fontFamily: "'Archivo', sans-serif",
          fontWeight: 600,
          fontSize: 15,
          color: BLACK
        }}>
            
            View on GitHub →
          </a>
        </div>

        {/* stamped tags */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <StampTag bg={ACID} fg={BLACK} label="FREE" />
          <StampTag bg="#fff" fg={BLACK} label="OPEN SOURCE" />
          <StampTag bg={BLACK} fg="#fff" label="CHROME + FIREFOX" />
        </div>
      </div>

      {/* by Intuned */}
      <div className="relative z-10" style={{
      fontFamily: "'Archivo', sans-serif",
      fontSize: 12,
      color: '#9ca3af'
    }}>
        
        by Intuned
      </div>
    </aside>;
};
const AddToChrome: React.FC = () => {
  const [pressed, setPressed] = useState(false);
  return <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} className="inline-flex items-center gap-2 px-5 py-3 text-white" style={{
    backgroundColor: BLACK,
    fontFamily: "'Archivo', sans-serif",
    fontWeight: 600,
    fontSize: 15,
    boxShadow: pressed ? `0 0 0 0 ${ACID}` : `6px 6px 0 0 ${ACID}`,
    transform: pressed ? 'translate(6px,6px)' : 'translate(0,0)',
    transition: 'transform 90ms ease, box-shadow 90ms ease'
  }}>
      
      <span aria-hidden style={{
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: `conic-gradient(${ACID} 0 33%, #fff 0 66%, ${ACID} 0)`,
      border: '2px solid #fff'
    }} />
      
      Add to Chrome
    </a>;
};
const StampTag: React.FC<{
  bg: string;
  fg: string;
  label: string;
}> = ({
  bg,
  fg,
  label
}) => <span className="inline-flex items-center px-2.5 py-1 uppercase" style={{
  backgroundColor: bg,
  color: fg,
  border: `2px solid ${BLACK}`,
  boxShadow: `3px 3px 0 0 ${BLACK}`,
  fontFamily: "'Space Mono', monospace",
  fontWeight: 700,
  fontSize: 12,
  letterSpacing: '0.02em'
}}>
  
    [ {label} ]
  </span>;

/* ===========================================================================
   RIGHT STAGE — sticky browser window + single fixed caption + bottom bar
   No right-gutter rail. Beat identity lives ONLY in the caption + bar below.
   ========================================================================== */
const PHASES: {
  a: number;
  b: number;
  n: string;
  text: string;
}[] = [{
  a: 0.0,
  b: 0.14,
  n: '01',
  text: 'PAGE — pick this element'
}, {
  a: 0.14,
  b: 0.36,
  n: '02',
  text: 'PICK — anchored to the label'
}, {
  a: 0.36,
  b: 0.52,
  n: '03',
  text: 'NOT THIS — DevTools copies brittle'
}, {
  a: 0.52,
  b: 0.74,
  n: '04',
  text: 'LIST — pick one, get them all'
}, {
  a: 0.74,
  b: 0.88,
  n: '05',
  text: 'USE — drop it in'
}, {
  a: 0.88,
  b: 1.0,
  n: '06',
  text: 'SHIP'
}];
export const RightStage: React.FC<{
  p: number;
}> = ({
  p
}) => {
  return <div className="relative h-full w-full bg-white">
      {/* dot grid faint */}
      <div aria-hidden className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(${BLACK} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.04
    }} />

      {/* STAGE — browser window stacked over caption + progress bar.
         Right padding keeps the window ≥ 28px clear of the canvas edge. */}
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{
      paddingLeft: 40,
      paddingRight: 40,
      paddingTop: 32,
      paddingBottom: 20
    }}>
        <div className="flex w-full max-w-[760px] flex-col items-stretch">
          <BrowserWindow p={p} />
          {/* SINGLE fixed phase caption + thin horizontal progress bar — UNDER the window */}
          <StageProgress p={p} />
        </div>
      </div>
    </div>;
};

/* ---- caption + horizontal progress bar (under the browser window) -------- */
const StageProgress: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const cur = PHASES.find(c => p >= c.a - 0.001 && p < c.b) || PHASES[PHASES.length - 1];
  return <div className="mt-4 w-full">
      {/* single caption line — Space Mono uppercase, one line, centered */}
      <div className="mb-2 w-full overflow-hidden text-center" style={{
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 12,
      letterSpacing: '0.04em',
      color: BLACK,
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis'
    }}>
        <span style={{
        color: BLACK
      }}>{cur.n}</span>
        <span style={{
        color: '#9ca3af'
      }}> · </span>
        <span className="uppercase">{cur.text}</span>
      </div>
      {/* thin horizontal progress bar: 2px black track, acid fill = P, 6 ticks */}
      <div className="relative w-full" style={{
      height: 2,
      backgroundColor: BLACK
    }}>
        {/* acid fill */}
        <div className="absolute left-0 top-0" style={{
        height: 2,
        width: `${clamp(p) * 100}%`,
        backgroundColor: ACID
      }} />
        {/* up to 6 tick marks */}
        {PHASES.map((ph, i) => {
        const reached = p >= ph.a - 0.001;
        return <span key={i} aria-hidden className="absolute" style={{
          left: `${ph.a * 100}%`,
          top: -2,
          width: 2,
          height: 6,
          transform: 'translateX(-1px)',
          backgroundColor: reached ? ACID : BLACK
        }} />;
      })}
      </div>
      {/* scroll hint — fades out after the first beat */}
      <div className="mt-1.5 text-center uppercase" style={{
      fontFamily: "'Space Mono', monospace",
      fontSize: 9,
      letterSpacing: '0.08em',
      color: '#9ca3af',
      opacity: clamp(1 - p / 0.03)
    }}>
        scroll ↓
      </div>
    </div>;
};

/* ===========================================================================
   BROWSER WINDOW — brutalist chrome (constant) + animated inner content
   ========================================================================== */
const BrowserWindow: React.FC<{
  p: number;
}> = ({
  p
}) => {
  return <div className="relative flex w-full max-w-[760px] flex-col" style={{
    height: 'min(660px, 76vh)',
    border: `2px solid ${BLACK}`,
    backgroundColor: '#fff',
    boxShadow: `10px 10px 0 0 ${BLACK}`
  }}>
      
      {/* TOP BAR */}
      <div className="flex items-center gap-2 border-b-2 px-3 py-2" style={{
      borderColor: BLACK,
      backgroundColor: '#fff'
    }}>
        
        {/* square brutalist dots */}
        <span style={{
        width: 11,
        height: 11,
        backgroundColor: BLACK
      }} />
        <span style={{
        width: 11,
        height: 11,
        border: `2px solid ${BLACK}`
      }} />
        <span style={{
        width: 11,
        height: 11,
        border: `2px solid ${BLACK}`
      }} />
        {/* tab */}
        <div className="ml-3 flex items-center gap-2 px-3 py-1" style={{
        border: `2px solid ${BLACK}`,
        borderBottom: 'none',
        backgroundColor: '#fff',
        fontFamily: "'Space Mono', monospace",
        fontSize: 11
      }}>
          
          <span style={{
          width: 8,
          height: 8,
          backgroundColor: ACID,
          border: `1.5px solid ${BLACK}`
        }} />
          SAM.gov · RFP-2026-0142
        </div>
      </div>

      {/* ADDRESS BAR + extension toolbar */}
      <div className="flex items-center gap-2 border-b-2 px-3 py-2" style={{
      borderColor: BLACK,
      backgroundColor: '#fafafa'
    }}>
        
        <div className="flex items-center gap-1" style={{
        color: '#6b7280'
      }}>
          <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12
        }}>←</span>
          <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12
        }}>→</span>
          <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12
        }}>⟳</span>
        </div>
        <div className="flex flex-1 items-center gap-2 px-3 py-1" style={{
        border: `2px solid ${BLACK}`,
        backgroundColor: '#fff'
      }}>
          
          <span style={{
          color: '#16a34a',
          fontSize: 11
        }}>🔒</span>
          <span className="truncate" style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 12,
          color: '#374151'
        }}>
            
            bidportal.example/opp/RFP-2026-0142/view
          </span>
        </div>
        {/* extension toolbar icon */}
        <ToolbarExtIcon p={p} />
      </div>

      {/* VIEWPORT — page content + extension UI live here; story animates */}
      <div className="relative flex-1 overflow-hidden" style={{
      backgroundColor: '#fff'
    }}>
        <BrowserBody p={p} />
      </div>
    </div>;
};
const ToolbarExtIcon: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const live = p > 0.04;
  return <div className="relative">
      <div className="flex items-center justify-center" style={{
      width: 26,
      height: 26,
      backgroundColor: live ? ACID : '#fff',
      border: `2px solid ${BLACK}`,
      transition: 'background-color 0.2s'
    }}>
        
        <span style={{
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 13
      }}>F</span>
      </div>
      {/* live dot */}
      {live && <span className="absolute" style={{
      top: -3,
      right: -3,
      width: 8,
      height: 8,
      backgroundColor: RED,
      border: `1.5px solid ${BLACK}`,
      borderRadius: '50%',
      animation: 'forgeBlink 1.4s steps(1) infinite'
    }} />}
    </div>;
};

/* ===========================================================================
   BROWSER BODY — the gov page + all phase overlays (pure functions of P)
   ========================================================================== */
const BrowserBody: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // The page scrolls a little between the detail (dl) section and the files section.
  // Phase 04 reveals the Solicitation Files section -> shift content up.
  const filesShift = ramp(p, 0.5, 0.6); // 0 -> 1
  const pageY = -filesShift * 150; // px upward

  return <div className="relative h-full w-full">
      {/* The actual page (scrolls) */}
      <div className="absolute inset-0" style={{
      transform: `translateY(${pageY}px)`,
      transition: 'none'
    }}>
        
        <GovPage p={p} />
      </div>

      {/* Crosshair / picker cursor (phase 02 + 04) */}
      <PickerCursor p={p} />

      {/* Forge popup (selector + judge chip) */}
      <ForgePopup p={p} />

      {/* DevTools brittle context menu (phase 03) */}
      <DevToolsMenu p={p} />

      {/* List-mode brittle note (phase 04) */}
      <ListBrittleNote p={p} />

      {/* USE-CASE cards (phase 05) */}
      <UseCaseCards p={p} />

      {/* CLOSING / SHIP (phase 06) */}
      <ClosingPanel p={p} />
    </div>;
};

/* ---- the gov procurement page (generic procurement-portal style) --------- */
const GovPage: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // Highlight the VALUE "Request for Proposal" — present at REST (P=0) and through
  // the opening pick beat so the resting state reads "pick THIS element".
  const pickRest = 1 - ramp(p, 0.0, 0.06); // 1 at rest, eases to handoff
  const pickW = Math.max(pickRest * (1 - ramp(p, 0.06, 0.12)), phaseWeight(p, 0.1, 0.5));
  // Anchor box appears on the LABEL only once we move into the pick beat.
  const anchorW = phaseWeight(p, 0.16, 0.5);
  // highlight whole files list one-by-one during 04
  const listP = ramp(p, 0.56, 0.72);
  const files = ['RFP-2026-0142_SOW.pdf', 'RFP-2026-0142_Pricing.xlsx', 'Attachment_A_Terms.pdf', 'Q&A_Addendum_1.pdf', 'Wage_Determination.pdf'];
  return <div className="h-full w-full px-7 py-5" style={{
    fontFamily: "'Archivo', sans-serif"
  }}>
      {/* agency header */}
      <div className="mb-3 flex items-center gap-3 border-b pb-3" style={{
      borderColor: '#e5e7eb'
    }}>
        <div className="flex items-center justify-center" style={{
        width: 30,
        height: 30,
        backgroundColor: '#1d4ed8',
        color: '#fff',
        fontWeight: 700,
        fontSize: 12
      }}>
          
          GSA
        </div>
        <div>
          <div style={{
          fontSize: 11,
          color: '#6b7280',
          fontWeight: 600,
          letterSpacing: '0.04em'
        }}>
            U.S. GENERAL SERVICES ADMINISTRATION
          </div>
          <div style={{
          fontSize: 10,
          color: '#9ca3af'
        }}>Contract Opportunities · beta.SAM.gov</div>
        </div>
      </div>

      {/* title */}
      <h2 style={{
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 700,
      fontSize: 22,
      margin: '0 0 12px',
      color: BLACK
    }}>
        Solicitation RFP-2026-0142
      </h2>

      {/* dl rows */}
      <dl className="mb-5" style={{
      margin: 0
    }}>
        <DlRow label="Solicitation Type" value="Request for Proposal" highlightValue={pickW} anchorLabel={anchorW} />
        <DlRow label="Status" value="Open" />
        <DlRow label="Due Date" value="July 3, 2026" />
      </dl>

      {/* Solicitation Files section */}
      <div style={{
      border: `1px solid #e5e7eb`,
      padding: '12px 14px',
      backgroundColor: '#fcfcfc'
    }}>
        
        <h3 style={{
        fontFamily: "'Bricolage Grotesque', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        margin: '0 0 8px',
        color: BLACK
      }}>
          
          Solicitation Files
        </h3>
        <ul style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }}>
          {files.map((f, i) => {
          // ignite one-by-one
          const on = listP > (i + 0.4) / files.length ? 1 : listP > i / files.length ? (listP - i / files.length) * files.length : 0;
          return <li key={f} className="relative flex items-center gap-2">
                <span style={{
              color: '#9ca3af',
              fontSize: 11
            }}>📎</span>
                <a href="#" onClick={e => e.preventDefault()} className="relative" style={{
              fontSize: 13,
              color: '#1d4ed8',
              textDecoration: 'underline'
            }}>
                  
                  {f}
                  {/* acid ignite highlight */}
                  <span aria-hidden className="absolute" style={{
                inset: '-2px -4px',
                backgroundColor: ACID,
                opacity: clamp(on) * 0.45,
                outline: clamp(on) > 0.1 ? `2px solid ${ACID}` : 'none',
                zIndex: -1
              }} />
                  
                </a>
              </li>;
        })}
        </ul>
      </div>
    </div>;
};
const DlRow: React.FC<{
  label: string;
  value: string;
  highlightValue?: number;
  anchorLabel?: number;
}> = ({
  label,
  value,
  highlightValue = 0,
  anchorLabel = 0
}) => {
  return <div className="relative flex items-start gap-4 border-b py-2" style={{
    borderColor: '#f3f4f6'
  }}>
      <dt className="relative" style={{
      width: 150,
      flexShrink: 0,
      fontSize: 12,
      fontWeight: 600,
      color: '#6b7280',
      letterSpacing: '0.02em'
    }}>
        
        {label}
        {/* ANCHOR box on the LABEL cell — the reliability moment */}
        {anchorLabel > 0.02 && <span aria-hidden className="absolute" style={{
        inset: '-4px -6px',
        border: `2px solid ${BLACK}`,
        boxShadow: `0 0 0 3px ${ACID}`,
        opacity: clamp(anchorLabel),
        zIndex: 5
      }} />}
      </dt>
      <dd className="relative" style={{
      margin: 0,
      fontSize: 13,
      color: BLACK,
      fontWeight: 500
    }}>
        {value}
        {highlightValue > 0.02 && <span aria-hidden className="absolute" style={{
        inset: '-2px -5px',
        backgroundColor: ACID,
        opacity: clamp(highlightValue) * 0.4,
        outline: `2px solid ${ACID}`,
        zIndex: -1
      }} />}
      </dd>
    </div>;
};

/* ---- picker crosshair cursor --------------------------------------------- */
const PickerCursor: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // At REST (P=0) and through the opening beat the crosshair sits ON the VALUE
  // target cell so the frame reads "pick THIS element", not "a web page".
  const pick = Math.max(1 - ramp(p, 0.0, 0.1), phaseWeight(p, 0.08, 0.36));
  // Phase 04: crosshair over files
  const list = phaseWeight(p, 0.54, 0.72);
  const active = Math.max(pick, list);
  if (active < 0.02) return null;

  // position: the VALUE cell ("Request for Proposal") is the focal pick target.
  // page area starts ~118px from top of viewport (after header+title).
  const valuePos = {
    left: 268,
    top: 112
  };
  const filesPos = {
    left: 130,
    top: 360
  };
  const tgt = pick >= list ? valuePos : filesPos;
  return <div className="pointer-events-none absolute" style={{
    left: tgt.left,
    top: tgt.top,
    zIndex: 35,
    opacity: clamp(active),
    transform: `scale(${0.9 + 0.1 * active})`
  }}>

      {/* crosshair */}
      <div className="relative" style={{
      width: 40,
      height: 40
    }}>
        <span className="absolute" style={{
        left: 19,
        top: 0,
        width: 2,
        height: 40,
        backgroundColor: BLACK
      }} />
        <span className="absolute" style={{
        left: 0,
        top: 19,
        width: 40,
        height: 2,
        backgroundColor: BLACK
      }} />
        <span className="absolute" style={{
        left: 13,
        top: 13,
        width: 14,
        height: 14,
        border: `2px solid ${BLACK}`,
        boxShadow: `0 0 0 3px ${ACID}`,
        backgroundColor: 'transparent'
      }} />

      </div>
      {/* floating acid tag label — names the action on this target */}
      <div className="absolute whitespace-nowrap px-2 py-0.5" style={{
      left: 38,
      top: 6,
      backgroundColor: ACID,
      border: `2px solid ${BLACK}`,
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 10
    }}>

        {pick >= list ? 'PICK · dd VALUE' : 'a[href*=/files/]'}
      </div>
    </div>;
};

/* ---- Forge popup (anchored near toolbar) --------------------------------- */
const ForgePopup: React.FC<{
  p: number;
}> = ({
  p
}) => {
  // Show during pick (02), persist into not-this (03) and list (04). Hide for 05/06.
  const elementSel = phaseWeight(p, 0.16, 0.52);
  const listSel = phaseWeight(p, 0.54, 0.74);
  const w = Math.max(elementSel, listSel);
  if (w < 0.02) return null;
  const isList = listSel > elementSel;
  const selector = isList ? "//div[contains(@class, 'section') and .//h2[normalize-space()='Solicitation Files']]//a[contains(@href, '/files/')]" : "//dt[normalize-space()='Solicitation Type']/following-sibling::dd";
  return <div className="absolute" style={{
    right: 14,
    top: 12,
    width: 300,
    zIndex: 45,
    opacity: clamp(w),
    transform: `translateY(${(1 - clamp(w)) * -8}px)`
  }}>
      
      {/* connector to toolbar */}
      <div className="absolute" style={{
      right: 12,
      top: -10,
      width: 2,
      height: 10,
      backgroundColor: BLACK
    }} />
      
      <div style={{
      border: `2px solid ${BLACK}`,
      backgroundColor: '#fff',
      boxShadow: `5px 5px 0 0 ${BLACK}`
    }}>
        {/* header */}
        <div className="flex items-center justify-between px-2.5 py-1.5" style={{
        borderBottom: `2px solid ${BLACK}`,
        backgroundColor: BLACK
      }}>
          
          <div className="flex items-center gap-1.5">
            <span style={{
            width: 12,
            height: 12,
            backgroundColor: ACID,
            border: `1.5px solid #fff`
          }} />
            <span style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 11,
            color: '#fff'
          }}>
              selector-forge
            </span>
          </div>
          <span style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 9,
          color: '#9ca3af'
        }}>
            {isList ? 'LIST' : 'ELEMENT'}
          </span>
        </div>
        {/* selector code */}
        <div className="px-2.5 py-2">
          <div style={{
          fontFamily: "'Space Mono', monospace",
          fontSize: 10.5,
          lineHeight: 1.4,
          color: BLACK,
          wordBreak: 'break-word',
          backgroundColor: '#f7f7f7',
          border: '1px solid #e5e7eb',
          padding: '6px 7px'
        }}>
            
            {selector}
          </div>
          {/* judge chip */}
          <div className="mt-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5" style={{
            backgroundColor: '#dcfce7',
            border: `2px solid #16a34a`,
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 10,
            color: '#15803d'
          }}>
              
              <span style={{
              color: '#16a34a'
            }}>✓</span> JUDGE: RELIABLE
            </span>
            {isList && <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 9.5,
            color: '#6b7280'
          }}>
              
                5 / 5 matched
              </span>}
          </div>
        </div>
      </div>
    </div>;
};

/* ---- DevTools brittle context menu (phase 03) ---------------------------- */
const DevToolsMenu: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const w = phaseWeight(p, 0.37, 0.51, 0.025);
  if (w < 0.02) return null;
  return <div className="absolute" style={{
    left: 130,
    top: 250,
    zIndex: 38,
    opacity: clamp(w) * 0.98,
    transform: `translateY(${(1 - clamp(w)) * 8}px)`,
    width: 360
  }}>
      
      {/* "what DevTools copies" label */}
      <div className="mb-1 inline-flex items-center px-2 py-0.5" style={{
      backgroundColor: '#fff',
      border: `2px solid ${RED}`,
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 9.5,
      color: RED
    }}>
        
        what DevTools copies
      </div>
      {/* context menu */}
      <div style={{
      border: `1px solid #999`,
      backgroundColor: '#f3f3f3',
      boxShadow: '4px 4px 0 0 rgba(0,0,0,0.25)',
      width: 220
    }}>
        {['Copy', 'Copy outerHTML'].map(t => <div key={t} className="px-3 py-1" style={{
        fontSize: 11,
        color: '#374151',
        fontFamily: "'Archivo', sans-serif"
      }}>
            {t}
          </div>)}
        <div className="flex items-center justify-between px-3 py-1" style={{
        backgroundColor: '#2563eb',
        color: '#fff',
        fontSize: 11,
        fontFamily: "'Archivo', sans-serif"
      }}>
          
          <span>Copy → Copy selector</span>
          <span>▸</span>
        </div>
        {['Copy JS path', 'Copy XPath'].map(t => <div key={t} className="px-3 py-1" style={{
        fontSize: 11,
        color: '#374151',
        fontFamily: "'Archivo', sans-serif"
      }}>
            {t}
          </div>)}
      </div>
      {/* the brittle selector it produces (red, truncated) */}
      <div className="mt-2" style={{
      border: `2px solid ${RED}`,
      backgroundColor: '#fff5f5',
      padding: '6px 8px',
      maxWidth: 360
    }}>
        
        <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9.5,
        lineHeight: 1.4,
        color: RED,
        wordBreak: 'break-word',
        maxHeight: 58,
        overflow: 'hidden'
      }}>
          
          {'#block-symsoft-content > div > main > div.field.field--name-dynamic-block-fieldnode-solicitation-fields-block.field--type-ds.field--label-hidden.field__item > div > div > div > div > div > div > div > dl > div:nth-child(1) > dd'}
          <span style={{
          color: RED
        }}>…</span>
        </div>
        <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        color: RED,
        marginTop: 3,
        fontWeight: 700
      }}>
          ✗ breaks on any layout change
        </div>
      </div>
    </div>;
};

/* ---- list brittle note (phase 04) ---------------------------------------- */
const ListBrittleNote: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const w = phaseWeight(p, 0.6, 0.74, 0.025);
  if (w < 0.02) return null;
  return <div className="absolute" style={{
    left: 16,
    bottom: 14,
    zIndex: 38,
    opacity: clamp(w),
    transform: `translateY(${(1 - clamp(w)) * 8}px)`,
    maxWidth: 320
  }}>
      
      <div style={{
      border: `2px solid ${RED}`,
      backgroundColor: '#fff5f5',
      padding: '6px 8px'
    }}>
        
        <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        fontWeight: 700,
        color: RED,
        marginBottom: 2
      }}>
          DevTools list selector
        </div>
        <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9.5,
        lineHeight: 1.4,
        color: RED,
        wordBreak: 'break-word'
      }}>
          
          {'.field__item:nth-child(6) a , .field__item:nth-child(5) a , .field__item:nth-child(3) a , .field__item:nth-child(1) a'}
        </div>
        <div style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 9,
        color: RED,
        marginTop: 3,
        fontWeight: 700
      }}>
          ✗ skips items · frozen count
        </div>
      </div>
    </div>;
};

/* ---- use-case cards (phase 05) ------------------------------------------- */
const UseCaseCards: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const w = phaseWeight(p, 0.74, 0.88, 0.03);
  if (w < 0.02) return null;
  const slide = (1 - clamp(w)) * 40;
  return <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8" style={{
    zIndex: 42,
    backgroundColor: 'rgba(255,255,255,0.96)',
    opacity: clamp(w)
  }}>

      <div className="mb-1 inline-flex items-center px-3 py-1 text-white" style={{
      backgroundColor: BLACK,
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 11
    }}>

        DROP IT IN
      </div>
      <div className="flex w-full max-w-[560px] flex-col gap-4">
        {/* Playwright */}
        <div style={{
        border: `2px solid ${BLACK}`,
        backgroundColor: '#fff',
        boxShadow: `6px 6px 0 0 ${ACID}`,
        transform: `translateY(${slide}px)`
      }}>
          
          <div className="flex items-center justify-between px-3 py-1.5" style={{
          borderBottom: `2px solid ${BLACK}`,
          backgroundColor: '#f7f7f7'
        }}>
            
            <span style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 11
          }}>WORKS IN YOUR TESTS</span>
            <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: '#6b7280'
          }}>playwright.spec.ts</span>
          </div>
          <div className="px-3 py-2.5">
            <code style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            lineHeight: 1.5,
            color: BLACK,
            display: 'block',
            wordBreak: 'break-word'
          }}>
              await page.locator(
              <span style={{
              color: '#15803d'
            }}>"xpath=//dt[normalize-space()='Solicitation Type']/following-sibling::dd"</span>
              )
            </code>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5" style={{
            backgroundColor: '#dcfce7',
            border: '2px solid #16a34a'
          }}>
              <span style={{
              color: '#16a34a',
              fontWeight: 700,
              fontSize: 11
            }}>✓</span>
              <span style={{
              fontFamily: "'Space Mono', monospace",
              fontWeight: 700,
              fontSize: 10,
              color: '#15803d'
            }}>1 passed</span>
            </div>
          </div>
        </div>
        {/* Scraper */}
        <div style={{
        border: `2px solid ${BLACK}`,
        backgroundColor: '#fff',
        boxShadow: `6px 6px 0 0 ${BLACK}`,
        transform: `translateY(${slide * 1.4}px)`
      }}>
          
          <div className="flex items-center justify-between px-3 py-1.5" style={{
          borderBottom: `2px solid ${BLACK}`,
          backgroundColor: '#f7f7f7'
        }}>
            
            <span style={{
            fontFamily: "'Space Mono', monospace",
            fontWeight: 700,
            fontSize: 11
          }}>WORKS IN YOUR SCRAPER</span>
            <span style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 10,
            color: '#6b7280'
          }}>output.json</span>
          </div>
          <div className="px-3 py-2.5">
            <pre style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: 11,
            lineHeight: 1.5,
            color: BLACK,
            margin: 0
          }}>
{`{ "solicitationType": `}<span style={{
              color: '#15803d'
            }}>"Request for Proposal"</span>{` }`}
            </pre>
          </div>
        </div>
      </div>
    </div>;
};

/* ---- closing / ship panel (phase 06) ------------------------------------- */
const ClosingPanel: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const w = phaseWeight(p, 0.88, 1.0, 0.03);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const onSub = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  }, [email]);
  if (w < 0.02) return null;
  return <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-8" style={{
    zIndex: 44,
    backgroundColor: 'rgba(255,255,255,0.985)',
    opacity: clamp(w)
  }}>
      
      <h2 style={{
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontWeight: 800,
      fontSize: 40,
      lineHeight: 1,
      textAlign: 'center',
      margin: 0,
      letterSpacing: '-0.02em'
    }}>
        
        Every selector,
        <br />
        <span className="relative inline-block">
          judged.
          <span aria-hidden className="absolute" style={{
          left: '-2%',
          right: '-2%',
          bottom: 4,
          height: 9,
          backgroundColor: ACID,
          zIndex: -1
        }} />
          
        </span>
      </h2>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5" style={{
        backgroundColor: ACID,
        border: `2px solid ${BLACK}`,
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 700,
        fontSize: 14,
        boxShadow: `4px 4px 0 0 ${BLACK}`
      }}>
          
          Add to Chrome
        </a>
        <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" className="inline-flex items-center px-5 py-2.5" style={{
        border: `2px solid ${BLACK}`,
        backgroundColor: '#fff',
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 600,
        fontSize: 14
      }}>
          
          GitHub →
        </a>
      </div>

      {/* CLI coming soon strip */}
      <div className="flex w-full max-w-[460px] items-center gap-3 px-3 py-2.5" style={{
      border: `2px dashed ${BLACK}`,
      backgroundColor: '#fafafa'
    }}>
        
        <span className="px-2 py-0.5" style={{
        backgroundColor: BLACK,
        color: ACID,
        fontFamily: "'Space Mono', monospace",
        fontWeight: 700,
        fontSize: 10
      }}>
          
          CLI · COMING SOON
        </span>
        <code style={{
        fontFamily: "'Space Mono', monospace",
        fontSize: 12,
        color: '#374151'
      }}>
          $ npx selector-forge
        </code>
      </div>

      {/* email capture */}
      {!subscribed ? <form onSubmit={onSub} className="flex w-full max-w-[460px] items-stretch gap-0">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@work.com" className="flex-1 px-3 py-2" style={{
        border: `2px solid ${BLACK}`,
        borderRight: 'none',
        fontFamily: "'Archivo', sans-serif",
        fontSize: 13,
        outline: 'none'
      }} />
        
          <button type="submit" className="px-4 py-2 text-white" style={{
        backgroundColor: BLACK,
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 700,
        fontSize: 13,
        border: `2px solid ${BLACK}`
      }}>
          
            Get notified
          </button>
        </form> : <div className="inline-flex items-center gap-2 px-4 py-2" style={{
      backgroundColor: '#dcfce7',
      border: `2px solid #16a34a`,
      fontFamily: "'Space Mono', monospace",
      fontWeight: 700,
      fontSize: 13,
      color: '#15803d'
    }}>
        
          ✓ you're on the list
        </div>}

      {/* blog link */}
      <a href="https://github.com/Intuned/selector-forge" target="_blank" rel="noreferrer" style={{
      fontFamily: "'Archivo', sans-serif",
      fontSize: 13,
      color: '#374151',
      textDecoration: 'underline',
      textUnderlineOffset: 3
    }}>
        
        Why Static Selectors Fail →
      </a>
    </div>;
};

/* ===========================================================================
   SHIP FRAME — the final frame of the scroll story, lifted out as a static
   composition. Mirrors the root layout EXACTLY (centered max-w-[1440px], the
   fixed LeftColumn at 40% + the RightStage at 60%) but swaps the 480vh scroll
   track for a single h-screen so it renders as one still frame. `p` defaults
   to the SHIP beat (0.95) — where ClosingPanel ("Every selector, judged.") is
   fully revealed and StageProgress reads "06 · SHIP".
   ========================================================================== */
export const ShipFrame: React.FC<{
  p?: number;
}> = ({
  p = 0.95
}) => {
  return <div className="relative w-full bg-white" style={{
    fontFamily: "'Archivo', sans-serif",
    color: BLACK
  }}>
      <div className="mx-auto flex w-full max-w-[1440px]">
        <LeftColumn />
        <div className="relative" style={{
        width: '60%'
      }}>
          <div className="h-screen w-full overflow-hidden">
            <RightStage p={p} />
          </div>
        </div>
      </div>
    </div>;
};