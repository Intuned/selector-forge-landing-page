import { useEffect } from "react";
import type { Story } from "@ladle/react";
import { BrowserWindow } from "./ForgeBrowserAnnotatedOrange";

// Frames lifted from "Forge — Browser · Annotated (orange)" (solid-city-1021).
// The scroll story plays INSIDE the browser's content viewport and is a pure
// function of one progress value `p` in [0,1]. These stories render the browser
// ON ITS OWN — no left manifesto column, no progress rail, no caption band —
// and freeze `p` at the requested beat.
//
// BrowserWindow is width/height:100%, so it needs a definite-size parent. The
// Stage below gives it the near-full viewport (the browser "expands almost to
// the edge of the screen"); the padding just leaves room for its 8px hard
// shadow so it never clips against the canvas edge.
export default { title: "Experiments/Browser Annotated" };

// Force the GovPage to re-measure its dt→dd / list connector geometry once the
// fonts + layout have settled. The component already measures on mount + a
// 120ms timer + on window resize; in a static (non-scrolling) story we nudge a
// resize so the orange anchor arrow lands on the right coordinates.
function useRemeasure() {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const t1 = window.setTimeout(fire, 80);
    const t2 = window.setTimeout(fire, 260);
    const t3 = window.setTimeout(fire, 560);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);
}

const Stage = ({ p }: { p: number }) => {
  useRemeasure();
  return (
    <div
      className="flex h-screen w-screen items-stretch justify-center overflow-hidden"
      style={{
        background: "#ffffff",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 1.6px)",
        backgroundSize: "18px 18px",
        // ~32px inset all round + a little extra on the shadow sides so the
        // window expands almost to the edge without clipping its 8px shadow.
        padding: "32px 40px 40px 32px",
        boxSizing: "border-box",
      }}
    >
      <BrowserWindow p={p} />
    </div>
  );
};

// ASK 1 — the browser ON ITS OWN, expanded almost to the edge of the screen,
// at rest: the procurement page loaded with the extension popup docked in its
// empty "Point at any element" state. View via Ladle's fullscreen toggle (or
// append &mode=preview) since it's w-screen / h-screen.
export const BrowserOnly: Story = () => <Stage p={0.01} />;

// ASK 2 — the ELEMENT beat: the orange connector arrow drawn from the
// "Solicitation Type" label across to its value ("Request for Proposal"), the
// dt outlined + the dd filled orange, and the "anchored to the label" chip. A
// pixel-faithful freeze of the annotated frame.
export const AnchorAnnotation: Story = () => <Stage p={0.32} />;

// Scrub `p` to play the whole in-browser story (LOAD → ELEMENT → TOGGLE → LIST
// → DEPLOY → JUDGED) inside the isolated browser.
export const BrowserInteractive: Story<{ p: number }> = ({ p }) => (
  <Stage p={p} />
);
BrowserInteractive.args = { p: 0.32 };
BrowserInteractive.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
