import type { Story } from "@ladle/react";
import { LeftColumn } from "./LeftColumn";
import { RightColumn } from "./RightColumn";

// Feedback #4: where should the left-panel manifesto sit? These render the FULL
// landing page (left manifesto + right browser column) so each placement can be
// judged in context against the browser — not the panel in isolation. Only the
// LeftColumn's vAlign/xAlign differ between stories; the right column is the
// real scroll engine (starts at the INTRO beat — scroll it if you like).
// View via Ladle fullscreen / &mode=preview (the page is w-screen h-screen).
export default { title: "Forge/Experiments" };

// The same 40/60 shell the root component uses, with a configurable LeftColumn.
const Page = ({
  vAlign,
  xAlign,
}: {
  vAlign: "spread" | "top";
  xAlign: "left" | "center";
}) => (
  <div className="flex h-screen w-screen overflow-hidden bg-white">
    <div className="relative h-full w-[40%] shrink-0">
      <LeftColumn vAlign={vAlign} xAlign={xAlign} />
    </div>
    <div className="relative h-full w-[60%] shrink-0">
      <RightColumn />
    </div>
  </div>
);

// SPREAD / LEFT — current: badge top, manifesto centered, footer bottom; left.
export const PosSpreadLeft: Story = () => <Page vAlign="spread" xAlign="left" />;

// TOP / LEFT — manifesto grouped near the top, footer pinned bottom; left.
export const PosTopLeft: Story = () => <Page vAlign="top" xAlign="left" />;

// SPREAD / CENTER — vertically centered, horizontally centered.
export const PosSpreadCenter: Story = () => <Page vAlign="spread" xAlign="center" />;

// TOP / CENTER — grouped near the top, horizontally centered.
export const PosTopCenter: Story = () => <Page vAlign="top" xAlign="center" />;
