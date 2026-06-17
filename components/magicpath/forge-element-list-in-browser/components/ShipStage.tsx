'use client';

import React, { useState } from 'react';
import { ACID, MONO, HEAD, BODY, GITHUB, BLOG, TIER_CTA } from '../shared/tokens';
import { useInstallTarget } from '../shared/useInstallTarget';
import { captureWaitlistSignup } from '../shared/waitlist';
import { clamp, lerp, seg } from '../shared/math';
import { SHIP_A } from '../shared/constants';

/* ============================================================================
   SHIP STAGE — "Every selector, judged." ending (from solid-city-1021),
   recolored to acid; CLI command = npx intuned forge pick.
   ============================================================================ */
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
  boxShadow: `6px 6px 0 0 ${ACID}`,
  padding: '12px 14px'
}}>
    <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  }}>
      <span className="text-micro" style={{
      fontFamily: MONO,
      fontWeight: 700,
      color: '#000',
      background: ACID,
      padding: '2px 6px'
    }}>{index}</span>
      <span className="text-badge" style={{
      fontFamily: MONO,
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: '#fff'
    }}>{title}</span>
    </div>
    {children}
  </div>;
const ShipStage: React.FC<{
  p: number;
}> = ({
  p
}) => {
  const intro = seg(p, SHIP_A, SHIP_A + 0.05);
  const rise = seg(p, SHIP_A + 0.01, SHIP_A + 0.1);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [pressed, setPressed] = useState(false);
  const install = useInstallTarget();
  return <div style={{
    width: '100%',
    maxWidth: 620,
    margin: '0 auto',
    opacity: intro,
    transform: `translateY(${lerp(18, 0, rise)}px)`,
    willChange: 'transform, opacity'
  }}>
      {/* headline */}
      <h2 className="text-display-ship" style={{
      fontFamily: HEAD,
      fontWeight: 800,
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
          background: ACID,
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
        <UseCaseCard index="01" title="PLAYWRIGHT TEST">
          <div className="text-label" style={{
          fontFamily: MONO,
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
            color: ACID
          }}>locator</span>
            <span style={{
            color: '#fff'
          }}>(</span>
            <span style={{
            color: '#9be3ff',
            overflowWrap: 'anywhere'
          }}>"xpath=//dt[…]/…::dd"</span>
            <span style={{
            color: '#fff'
          }}>)</span>
            <span style={{
            color: '#fff'
          }}>.</span>
            <span style={{
            color: ACID
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
            <span className="text-badge" style={{
            fontFamily: MONO,
            fontWeight: 700,
            color: '#000',
            background: ACID,
            border: '2px solid #000',
            padding: '3px 7px',
            boxShadow: '3px 3px 0 0 #000'
          }}>✓ PASS</span>
            <span className="text-label" style={{
            fontFamily: BODY,
            color: '#9aa1ab'
          }}>1 passed (0.4s)</span>
          </div>
        </UseCaseCard>

        <UseCaseCard index="02" title="SCRAPER">
          <pre className="text-label" style={{
          fontFamily: MONO,
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
            color: ACID
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
          <div className="text-label" style={{
          marginTop: 12,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: BODY,
          color: '#9aa1ab'
        }}>
            <span style={{
            width: 8,
            height: 8,
            background: ACID,
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
        <a href={install.href} target="_blank" rel="noreferrer" onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseLeave={() => setPressed(false)} className="inline-flex items-center justify-center select-none" style={{
        background: '#000',
        color: '#fff',
        fontFamily: BODY,
        fontWeight: 700,
        fontSize: TIER_CTA.font,
        padding: '12px 22px',
        textDecoration: 'none',
        border: '2px solid #000',
        boxShadow: pressed ? '0 0 0 0 ' + ACID : `6px 6px 0 0 ${ACID}`,
        transform: pressed ? 'translate(2px,2px)' : 'translate(0,0)',
        transition: 'box-shadow 0.08s ease, transform 0.08s ease',
        whiteSpace: 'nowrap'
      }}>
          {install.label}
        </a>
        <a href={GITHUB} target="_blank" rel="noreferrer" className="sf-ghost2 inline-flex items-center justify-center select-none" style={{
        background: '#fff',
        color: '#000',
        fontFamily: BODY,
        fontWeight: 600,
        fontSize: TIER_CTA.font,
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
      border: `2px solid ${ACID}`,
      background: '#f6ffe1',
      padding: '12px 14px'
    }}>
        <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 9,
        flexWrap: 'wrap'
      }}>
          <span style={{
          width: 8,
          height: 8,
          borderRadius: 8,
          background: ACID,
          border: '1.5px solid #000',
          display: 'inline-block',
          animation: 'forgeCaretBlink 1.2s steps(1) infinite'
        }} />
          <span className="text-badge" style={{
          fontFamily: MONO,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#000',
          background: ACID,
          padding: '2px 7px',
          border: '2px solid #000'
        }}>CLI — COMING SOON</span>
          <span className="text-small" style={{
          fontFamily: BODY,
          color: '#374151'
        }}>
            Drive it from your terminal:{' '}
            <code style={{
            fontFamily: MONO,
            fontWeight: 700,
            color: '#000'
          }}>npx intuned forge pick</code>
          </span>
        </div>

        <form onSubmit={e => {
        e.preventDefault();
        const value = email.trim();
        if (!value) return;
        captureWaitlistSignup(value);
        setSent(true);
      }} className="flex flex-wrap items-center" style={{
        gap: 12
      }}>
          {!sent ? <>
              <input type="email" required value={email} onChange={e => {
            setEmail(e.target.value);
            setSent(false);
          }} placeholder="you@work.com" aria-label="email for CLI launch notification" className="text-body" style={{
            width: 260,
            background: '#fff',
            border: '2px solid #000',
            outline: 'none',
            padding: '12px 16px',
            fontFamily: MONO,
            color: '#000',
            boxShadow: '3px 3px 0 0 #000'
          }} />
              <button type="submit" className="sf-notify text-body" style={{
            border: '2px solid #000',
            background: ACID,
            color: '#000',
            padding: '12px 22px',
            fontFamily: MONO,
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            boxShadow: '3px 3px 0 0 #000',
            transition: 'transform 0.1s ease, box-shadow 0.1s ease'
          }}>
                GET NOTIFIED
              </button>
            </> : <div className="text-body" style={{
          border: '2px solid #000',
          background: ACID,
          boxShadow: '3px 3px 0 0 #000',
          padding: '12px 18px',
          fontFamily: MONO,
          fontWeight: 700,
          color: '#000'
        }}>
              ✓ you're on the list
            </div>}
          <a href={BLOG} target="_blank" rel="noreferrer" className="sf-blog2 text-small" style={{
          fontFamily: MONO,
          fontWeight: 700,
          color: '#000',
          textDecoration: 'underline',
          textUnderlineOffset: 3,
          padding: '2px 5px',
          transition: 'background 0.12s ease'
        }}>
            Why Static Selectors Fail →
          </a>
        </form>
      </div>

      <style>{`
        .sf-ghost2:hover{background:#000 !important;color:#fff !important;}
        .sf-notify:hover,.sf-notify:focus-visible{transform:translate(3px,3px);box-shadow:0 0 0 0 #000 !important;outline:none;}
        .sf-blog2:hover{background:${ACID} !important;color:#000 !important;}
      `}</style>
    </div>;
};

export { ShipStage };
