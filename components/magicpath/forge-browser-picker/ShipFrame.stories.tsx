import type { Story } from "@ladle/react";
import { ShipFrame } from "./ForgeBrowserPicker";

// The FINAL frame of "Forge — Browser Picker (Element & List)" (merry-city-9321)
// moved exactly: the fixed "Forged, not copied." manifesto column on the left,
// and the browser on the right showing the closing "Every selector, judged."
// panel (Add to Chrome / GitHub, the CLI · COMING SOON strip, the email
// capture), with the "06 · SHIP" caption + acid progress bar beneath it.
//
// ShipFrame mirrors the live root layout exactly (centered max-w-[1440px],
// LeftColumn 40% + RightStage 60%) but swaps the 480vh scroll track for a
// single h-screen, so it's the same still frame you'd land on at the end of the
// scroll. It's w-screen / h-screen — view it via Ladle's fullscreen toggle or
// append &mode=preview to the story URL.
export default { title: "Experiments/Browser Picker" };

// ASK 3 — the exact SHIP frame (p = 0.95, where the closing panel is fully
// revealed and StageProgress reads "06 · SHIP").
export const Ship: Story = () => <ShipFrame />;

// Scrub `p` to walk the bottom progress bar through the six beats
// (PAGE → PICK → NOT THIS → LIST → USE → SHIP) while keeping the exact layout.
export const ShipInteractive: Story<{ p: number }> = ({ p }) => (
  <ShipFrame p={p} />
);
ShipInteractive.args = { p: 0.95 };
ShipInteractive.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
