import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { ACID, INK, MONO } from "../../shared/tokens";

// Feedback #3: in the JUDGED popup the "RELIABLE · anchored to label" badge is
// too large — bigger than the "copy selector" button next to it. These options
// rework the verdict row so the badge no longer dominates. Each is shown in a
// popup-width card with the selector line + matches row for realistic context,
// so you can judge the badge vs the copy button. Pick one and I'll apply it.
export default { title: "Forge/Experiments" };

const CHECK = "✓";

// The copy-selector button as it is today (used by Current / A / B).
const CopyDefault = () => (
  <button
    type="button"
    className="inline-flex shrink-0 items-center justify-center gap-1 border-2 px-2.5 py-1"
    style={{
      borderColor: INK,
      fontFamily: MONO,
      fontWeight: 700,
      fontSize: 11,
      background: INK,
      color: "#fff",
      boxShadow: `3px 3px 0 0 ${ACID}`,
      whiteSpace: "nowrap",
    }}
  >
    copy selector
  </button>
);

// Tiny check chip (ink square, acid tick) reused by a couple of options.
const Tick = ({ bg, fg }: { bg: string; fg: string }) => (
  <span
    className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center"
    style={{ background: bg, color: fg, fontFamily: MONO, fontWeight: 700, fontSize: 10, lineHeight: 1 }}
  >
    {CHECK}
  </span>
);

// CURRENT — filled acid badge with the "· anchored to label" subtitle + shadow.
const RowCurrent = () => (
  <div className="flex items-center justify-between gap-2">
    <div className="flex items-center gap-1.5 border-2 px-2 py-1" style={{ borderColor: INK, background: ACID, boxShadow: `3px 3px 0 0 ${INK}` }}>
      <Tick bg={INK} fg={ACID} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, color: INK, letterSpacing: "0.02em" }}>RELIABLE</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 9, color: INK, opacity: 0.7 }}>· anchored to label</span>
    </div>
    <CopyDefault />
  </div>
);

// OPTION A — compact: drop the subtitle, lighter shadow, sized to match copy.
const RowA = () => (
  <div className="flex items-center justify-between gap-2">
    <span className="inline-flex items-center gap-1.5 border-2 px-2 py-1" style={{ borderColor: INK, background: ACID, boxShadow: `2px 2px 0 0 ${INK}` }}>
      <Tick bg={INK} fg={ACID} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, color: INK, letterSpacing: "0.02em" }}>RELIABLE</span>
    </span>
    <CopyDefault />
  </div>
);

// OPTION B — quiet: no box/shadow, just an acid tick + ink label (copy is the
// only "button"); "anchored" demoted to muted text.
const RowB = () => (
  <div className="flex items-center justify-between gap-2">
    <span className="inline-flex items-center gap-1.5">
      <Tick bg={ACID} fg={INK} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, color: INK, letterSpacing: "0.02em" }}>RELIABLE</span>
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 9, color: "#9ca3af" }}>anchored</span>
    </span>
    <CopyDefault />
  </div>
);

// OPTION C — copy-primary: RELIABLE becomes a small outlined tag; the acid
// emphasis moves to the copy action (the thing you actually click).
const RowC = () => (
  <div className="flex items-center justify-between gap-2">
    <span className="inline-flex items-center gap-1 border-2 px-2 py-0.5" style={{ borderColor: INK, background: "#fff" }}>
      <Tick bg={INK} fg={ACID} />
      <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 10, color: INK, letterSpacing: "0.02em" }}>RELIABLE</span>
    </span>
    <button
      type="button"
      className="inline-flex shrink-0 items-center justify-center gap-1 border-2 px-2.5 py-1"
      style={{ borderColor: INK, fontFamily: MONO, fontWeight: 700, fontSize: 11, background: ACID, color: INK, boxShadow: `3px 3px 0 0 ${INK}`, whiteSpace: "nowrap" }}
    >
      copy selector
    </button>
  </div>
);

// OPTION D — the orange-annotated variant's treatment, in acid: a small filled
// "reliability: high" chip (no shadow) + a small dark copy button pushed right.
// Both elements are compact and balanced — the proportion from
// ForgeBrowserAnnotatedOrange's ExtensionPopup.
const RowD = () => (
  <div className="flex items-center gap-2">
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 10, letterSpacing: "0.02em", color: "#000", background: ACID, border: `2px solid ${INK}`, padding: "3px 7px", whiteSpace: "nowrap" }}>
      reliability: high
    </span>
    <button type="button" style={{ marginLeft: "auto", fontFamily: MONO, fontWeight: 700, fontSize: 10, letterSpacing: "0.04em", color: "#fff", background: INK, border: `2px solid ${INK}`, padding: "4px 10px", whiteSpace: "nowrap" }}>
      copy
    </button>
  </div>
);

// A 300px popup-width card mirroring the JUDGED panel context (selector line +
// verdict row + matches footer), so the badge is judged exactly as it appears.
const Card = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="flex flex-col gap-2">
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: INK }}>
      {label}
    </span>
    <div className="flex flex-col bg-white" style={{ width: 300, border: `2px solid ${INK}`, boxShadow: `6px 6px 0 0 ${INK}` }}>
      <div className="px-2.5 pb-2.5 pt-2.5">
        <code style={{ fontFamily: MONO, fontWeight: 400, fontSize: 11.5, lineHeight: 1.5, color: INK, display: "block", minHeight: 34, wordBreak: "break-word" }}>
          {"//dt[normalize-space()='Solicitation Type']/following-sibling::dd"}
        </code>
        <div className="mt-2.5">{children}</div>
        <div style={{ marginTop: 10, borderTop: `2px solid ${INK}`, paddingTop: 8, display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 8.5, color: "#54616f", textTransform: "uppercase", letterSpacing: "0.08em" }}>matches</span>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontFamily: MONO, fontWeight: 700, fontSize: 8.5, color: "#000" }}>
            <span aria-hidden style={{ width: 8, height: 8, background: ACID, border: "1.5px solid #000", display: "inline-block" }} />
            this page
          </span>
        </div>
      </div>
    </div>
  </div>
);

// All options side by side for comparison.
export const ReliableBadgeOptions: Story = () => (
  <div className="flex flex-wrap items-start gap-10 bg-white p-10" style={{ fontFamily: MONO }}>
    <Card label="Current"><RowCurrent /></Card>
    <Card label="Option A — Compact"><RowA /></Card>
    <Card label="Option B — Quiet"><RowB /></Card>
    <Card label="Option C — Copy-primary"><RowC /></Card>
    <Card label="Option D — Reliability chip (chosen, acid)"><RowD /></Card>
  </div>
);
