'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ACID, INK, MONO, HEAD, BODY } from '../../shared/tokens';
import { clamp, lerp, seg, band } from '../../shared/math';
import { EL_B, LIST_A, LIST_B, W_TARGET } from '../../shared/constants';
import { PAGE, FILES } from '../../shared/data';

/* The browser now grows with the screen, so the page content must grow too.
   Content sits in a LEFT lane that fills the window minus a fixed right gutter
   reserved for the floating extension popup (right:12 + width:300 ≈ 312px), so
   the lane widens with the browser, the dead space to the popup stays tight,
   and the popup never overlaps the page. PAGE_PAD_X is the page's outer inset. */
const POPUP_GUTTER = 344;
const PAGE_PAD_X = 40;
const LANE_MAX = 860;

/* ============================================================================
   GOV PAGE — ONE continuous solicitation page (Details + Files) inside the
   browser. The page scrolls (translateY) so the Files section comes into focus
   for the LIST beat. Element anchoring (lock-frame + match-fill + acid
   connector) lands on the Details after the user clicks the value; the file
   list ignites in the Files section. `targetRef` is attached to the target
   <dd> cell so the parent cursor/inspect layers can measure it.
   ============================================================================ */
const GovPage: React.FC<{
  p: number;
  targetRef: React.RefObject<HTMLElement | null>;
}> = ({
  p,
  targetRef
}) => {
  // element-anchor drivers — ignite only AFTER the value is clicked (W_TARGET)
  const lock = band(p, W_TARGET + 0.005, EL_B, 0.02);
  const match = band(p, W_TARGET + 0.02, EL_B, 0.02);
  const connectorDraw = seg(p, W_TARGET + 0.02, 0.43);
  // chip appears as soon as the anchor lands (just after the value click) and
  // holds through the rest of the element beat, so it stays on screen ~2× longer.
  const elChip = band(p, W_TARGET + 0.02, EL_B, 0.03);

  // list ignite drivers (after the page has scrolled to Files)
  const igniteStart = LIST_A + 0.09;
  const igniteEnd = LIST_B - 0.02;
  const firstPicked = seg(p, LIST_A + 0.04, igniteStart);
  const itemLit = (i: number) => {
    const per = (igniteEnd - igniteStart) / FILES.length;
    const start = igniteStart + i * per;
    return seg(p, start, start + per + 0.01);
  };

  // ---- live geometry: connector endpoints + Files section offset ----
  const pageRef = useRef<HTMLDivElement>(null);
  const dtRef = useRef<HTMLSpanElement>(null);
  const ddRef = useRef<HTMLSpanElement>(null);
  const filesRef = useRef<HTMLDivElement>(null);
  const [geom, setGeom] = useState({
    dt: {
      x: 0,
      y: 0
    },
    dd: {
      x: 0,
      y: 0
    },
    filesTop: 0
  });
  const measure = useCallback(() => {
    const pg = pageRef.current;
    if (!pg) return;
    const pr = pg.getBoundingClientRect();
    const pt = (el: Element | null, side: 'left' | 'right') => {
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
      dt: pt(dtRef.current, 'right'),
      dd: pt(ddRef.current, 'left'),
      filesTop: filesRef.current ? filesRef.current.offsetTop : 0
    });
  }, []);
  useEffect(() => {
    measure();
    const t1 = window.setTimeout(measure, 140);
    const t2 = window.setTimeout(measure, 420);
    window.addEventListener('resize', measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  // browser scrolls down to focus the Files section for the list beat
  const shiftProg = seg(p, 0.47, 0.58);
  const shiftAmount = Math.max(0, geom.filesTop - 92);
  const pageShift = lerp(0, shiftAmount, shiftProg);
  const sysFont = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
  const mx = (geom.dt.x + geom.dd.x) / 2;
  const my = Math.max(geom.dt.y, geom.dd.y) + 14;
  const path = `M ${geom.dt.x + 4} ${geom.dt.y} Q ${mx} ${my} ${geom.dd.x - 4} ${geom.dd.y}`;
  const connectorOn = lock > 0.01 && geom.dt.x > 0 && geom.dd.x > 0;

  // combine the parent-supplied targetRef with the connector's own dd cell
  const setTargetCell = useCallback((el: HTMLElement | null) => {
    if (targetRef) (targetRef as React.MutableRefObject<HTMLElement | null>).current = el;
  }, [targetRef]);
  return <div className="absolute inset-0 overflow-hidden bg-white" style={{
    fontFamily: sysFont
  }}>
      <div ref={pageRef} style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      transform: `translateY(${-pageShift}px)`,
      willChange: 'transform'
    }}>
        {/* gov page header */}
        <div style={{
        background: '#16263a',
        padding: `16px ${PAGE_PAD_X}px`
      }}>
          <div className="text-label" style={{
          fontFamily: MONO,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.6)'
        }}>{PAGE.agency}</div>
          <div className="text-title" style={{
          fontFamily: BODY,
          fontWeight: 700,
          color: '#fff',
          marginTop: 3
        }}>{PAGE.title}</div>
        </div>

        {/* DETAILS section — left lane, reserves the popup gutter on the right */}
        <div style={{
        paddingLeft: PAGE_PAD_X,
        paddingRight: POPUP_GUTTER,
        paddingTop: 28,
        paddingBottom: 10
      }}>
          <h2 className="text-small" style={{
          margin: '0 0 14px',
          fontFamily: MONO,
          fontWeight: 700,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#7a828d'
        }}>Solicitation Details</h2>
          <dl style={{
          margin: 0,
          border: '1px solid #e3e6ea',
          width: '100%',
          maxWidth: LANE_MAX
        }}>
            {PAGE.rows.map((r, i) => {
            const isTarget = !!r.target;
            return <div key={r.label} style={{
              display: 'grid',
              gridTemplateColumns: '210px 1fr',
              alignItems: 'baseline',
              borderBottom: i < PAGE.rows.length - 1 ? '1px solid #e3e6ea' : 'none',
              background: i % 2 === 0 ? '#fafbfc' : '#fff'
            }}>
                  <dt className="text-label" style={{
                position: 'relative',
                padding: '11px 16px',
                borderRight: '1px solid #e3e6ea',
                fontFamily: MONO,
                fontWeight: 700,
                color: isTarget && lock > 0.4 ? '#000' : '#6b7280'
              }}>
                    {isTarget && <span aria-hidden style={{
                  position: 'absolute',
                  left: 3,
                  right: 3,
                  top: 3,
                  bottom: 3,
                  border: `2px solid ${ACID}`,
                  opacity: lock
                }} />}
                    <span ref={isTarget ? dtRef : undefined} style={{
                  position: 'relative'
                }}>{r.label}</span>
                  </dt>
                  <dd ref={isTarget ? setTargetCell : undefined} className="text-body" style={{
                position: 'relative',
                margin: 0,
                padding: '11px 16px',
                fontFamily: BODY,
                fontWeight: isTarget && match > 0.3 ? 700 : 400,
                color: '#16263a'
              }}>
                    {isTarget && <span aria-hidden style={{
                  position: 'absolute',
                  left: 3,
                  right: 3,
                  top: 3,
                  bottom: 3,
                  background: ACID,
                  opacity: match * 0.85,
                  transform: `scaleX(${lerp(0.7, 1, match)})`,
                  transformOrigin: 'left center'
                }} />}
                    <span ref={isTarget ? ddRef : undefined} style={{
                  position: 'relative',
                  color: isTarget && match > 0.4 ? '#000' : '#16263a'
                }}>{r.value}</span>
                  </dd>
                </div>;
          })}
          </dl>
        </div>

        {/* FILES section (same page; the browser scrolls down to focus this) */}
        <div ref={filesRef} className="section" style={{
        paddingLeft: PAGE_PAD_X,
        paddingRight: POPUP_GUTTER,
        paddingTop: 16
      }}>
          <h2 className="text-heading" style={{
          margin: '0 0 14px',
          fontFamily: HEAD,
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: '#16263a'
        }}>Solicitation Files</h2>
          <ul style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          width: '100%',
          maxWidth: LANE_MAX
        }}>
            {FILES.map((f, i) => {
            const lit = clamp(Math.max(itemLit(i), i === 0 ? firstPicked : 0));
            return <li key={f} style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 10px',
              margin: '4px 0'
            }}>
                  <span aria-hidden style={{
                position: 'absolute',
                inset: 0,
                background: ACID,
                border: '2px solid #000',
                opacity: lit * 0.92,
                transform: `scaleX(${lerp(0.65, 1, lit)})`,
                transformOrigin: 'left center'
              }} />
                  <span aria-hidden style={{
                position: 'relative',
                width: 12,
                height: 15,
                background: '#000',
                flexShrink: 0
              }} />
                  <a href={`/files/${f}`} onClick={e => e.preventDefault()} className="text-body" style={{
                position: 'relative',
                fontFamily: MONO,
                color: lit > 0.4 ? '#000' : '#1d4ed8',
                fontWeight: lit > 0.4 ? 700 : 500,
                textDecoration: 'underline'
              }}>{f}</a>
                  <span className="text-small" style={{
                position: 'relative',
                marginLeft: 'auto',
                fontFamily: MONO,
                fontWeight: 700,
                color: '#000',
                opacity: lit
              }}>✓</span>
                </li>;
          })}
          </ul>
        </div>

        {/* trailing whitespace so the scrolled view isn't cramped */}
        <div style={{
        height: 90
      }} />

        {/* on-page anchor chip — sits in the LEFT lane just below the anchored
           value (clear of the top-right popup), mirroring the experiment. */}
        {elChip > 0.001 && geom.dd.y > 0 && <span className="text-label" style={{
        position: 'absolute',
        zIndex: 12,
        top: geom.dd.y + 24,
        left: PAGE_PAD_X,
        background: ACID,
        color: '#000',
        border: '2px solid #000',
        boxShadow: '3px 3px 0 0 #000',
        padding: '5px 10px',
        fontFamily: MONO,
        fontWeight: 700,
        whiteSpace: 'nowrap',
        opacity: elChip,
        transform: `translateY(${lerp(6, 0, elChip)}px)`
      }}>
            anchored to the label
          </span>}

        {/* HERO anchor connector: dt.right → dd.left (replicates solid-city-1021).
           Marker lives on the THIN line (proportional arrow); a black edge path
           underneath gives the acid line contrast on white + on the acid fill. */}
        {connectorOn && <svg style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 8,
        overflow: 'visible'
      }}>
            <defs>
              <marker id="forge-arrow-acid" markerUnits="userSpaceOnUse" viewBox="0 0 12 12" refX="9" refY="6" markerWidth="15" markerHeight="15" orient="auto-start-reverse">
                <path d="M 1.5 1.5 L 11 6 L 1.5 10.5 z" fill={ACID} stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
              </marker>
            </defs>
            <g style={{
          opacity: lock
        }}>
              <path d={path} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - connectorDraw} />
              <path d={path} fill="none" stroke={ACID} strokeWidth={3} strokeLinecap="round" markerEnd="url(#forge-arrow-acid)" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - connectorDraw} />
              <circle cx={geom.dt.x + 4} cy={geom.dt.y} r={5} fill={ACID} stroke={INK} strokeWidth={1.5} />
            </g>
          </svg>}
      </div>
    </div>;
};

export { GovPage };
