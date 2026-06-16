import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { BrowserWindow } from "./BrowserWindow";

// The BROWSER element itself. BrowserWindow is the mock browser chrome that
// wraps the gov page and drives the whole in-browser choreography: it measures
// its own icon / "Pick element" button / target cell to move the cursor, drops
// the extension popup, and cross-fades the inspect highlight + connector. It's
// fully self-contained (only needs `p`). Each story below freezes a beat.
export default { title: "Forge/Browser" };

// BrowserWindow is height:min(720px,100%), so it needs a DEFINITE-height parent
// to resolve against (else its flex-1 content viewport collapses). Mirror
// RightColumn's containing block: an h-screen stage holding a min(760px,90%) box.
const Stage = ({ children }: { children: ReactNode }) => (
  <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-white">
    <div
      className="flex w-full items-center justify-center"
      style={{ height: "min(760px, 90%)" }}
    >
      {children}
    </div>
  </div>
);

const Browser = ({ p }: { p: number }) => (
  <Stage>
    <BrowserWindow p={p} />
  </Stage>
);

// RESTING — the page at rest with the "click selector-forge to start" callout.
export const BrowserResting: Story = () => <Browser p={0.01} />;

// ELEMENT — popup JUDGED, the value anchored to its label via the connector.
export const BrowserElementAnchored: Story = () => <Browser p={0.34} />;

// LIST — toggle on LIST, scrolled to Files, the file rows lighting up.
export const BrowserListPicked: Story = () => <Browser p={0.64} />;

// Scrub `p` to play the full icon-click -> pick -> inspect -> anchor -> list flow.
export const BrowserInteractive: Story<{ p: number }> = ({ p }) => (
  <Browser p={p} />
);
BrowserInteractive.args = { p: 0.3 };
BrowserInteractive.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
