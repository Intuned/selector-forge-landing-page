import { useEffect, useRef } from "react";
import type { Story } from "@ladle/react";
import { ForgeElementListInBrowser } from "./ForgeElementListInBrowser";

// A story per SCROLL STAGE — the beats the landing page moves through as you
// scroll the right column (the same beats marked on the progress rail:
// INTRO -> ELEMENT -> LIST -> SHIP).
//
// These do NOT re-implement the stages. Each one mounts the REAL landing page
// and drives its internal scroller to the scroll fraction that produces that
// beat, so every stage is a pixel-faithful snapshot of the live page. `p` (the
// value RightColumn derives = scrollTop / (track - viewport)) ends up at the
// fraction below. You can still scroll from there.
//
// The page is w-screen h-screen, so view these via Ladle's fullscreen toggle or
// append &mode=preview to the story URL.
export default { title: "Forge/Stages" };

// Build a story that freezes the page at a given scroll fraction (0..1).
function stageAtFraction(fraction: number): Story {
  const Stage: Story = () => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const root = ref.current;
      if (!root) return;
      // RightColumn's scroller is the only element with `overflow-y-auto`.
      const findScroller = () =>
        root.querySelector<HTMLElement>('[class*="overflow-y-auto"]');

      let raf = 0;
      let tries = 0;
      let settled = false;

      const apply = () => {
        const scroller = findScroller();
        const max = scroller ? scroller.scrollHeight - scroller.clientHeight : 0;
        if (scroller && max > 0) {
          // Setting scrollTop fires RightColumn's scroll listener, which updates
          // p; the resize event makes BrowserWindow/GovPage re-measure geometry
          // (cursor path, connector) against the new scroll position.
          scroller.scrollTop = fraction * max;
          window.dispatchEvent(new Event("resize"));
          settled = true;
        }
        if (!settled && tries++ < 90) raf = requestAnimationFrame(apply);
      };
      raf = requestAnimationFrame(apply);

      // Re-apply once the component's ~450ms measurement cascade has settled.
      const nudge = window.setTimeout(() => {
        const scroller = findScroller();
        if (!scroller) return;
        const max = scroller.scrollHeight - scroller.clientHeight;
        if (max > 0) {
          scroller.scrollTop = fraction * max;
          window.dispatchEvent(new Event("resize"));
        }
      }, 520);

      return () => {
        cancelAnimationFrame(raf);
        window.clearTimeout(nudge);
      };
    }, []);

    return (
      <div ref={ref} className="h-screen w-screen">
        <ForgeElementListInBrowser />
      </div>
    );
  };
  return Stage;
}

// p ~ 0.00 — INTRO: manifesto + browser at rest, the "scroll" hint visible.
export const Intro = stageAtFraction(0.0);

// p ~ 0.34 — ELEMENT: popup in its JUDGED state, the acid lock-frame on the
// label and the connector anchored to the "Solicitation Type" value.
export const Element = stageAtFraction(0.34);

// p ~ 0.64 — LIST: the toggle has slid to LIST, the page has scrolled to the
// Files section, and the file rows light up one by one.
export const List = stageAtFraction(0.64);

// p ~ 0.95 — SHIP: the "Every selector, judged." ending with the use-case
// cards, CTAs and the CLI-coming-soon email capture.
export const Ship = stageAtFraction(0.95);
