import type { Story } from "@ladle/react";
import { PickerCursor } from "./PickerCursor";

// PickerCursor is the single visible cursor that drives the intro choreography
// across the browser frame: it travels rest -> extension icon (click, popup
// drops) -> "Pick element" (click) -> morphs into an inspect crosshair -> the
// target value (click, anchors), with click ripples and a "click to anchor"
// hint. On the page BrowserWindow measures the real icon / button / target
// positions and passes them as `cg`; here we supply representative geometry.
// Cursor is visible ~p 0.02-0.40; default 0.26 (crosshair approaching target).
export default { title: "Forge/Browser" };

// Plausible geometry within the frame: icon top-right, popup button mid-right,
// target value cell mid-left — the same path the page lays out.
const cg = {
  icon: { x: 740, y: 22 },
  pick: { x: 690, y: 300 },
  target: { x: 230, y: 250, w: 160, h: 28 },
};

export const CursorChoreography: Story<{ p: number }> = ({ p }) => (
  <div
    className="relative overflow-hidden border-2 border-black bg-white"
    style={{ width: 780, height: 460 }}
  >
    <PickerCursor p={p} cg={cg} />
  </div>
);
CursorChoreography.args = { p: 0.26 };
CursorChoreography.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
