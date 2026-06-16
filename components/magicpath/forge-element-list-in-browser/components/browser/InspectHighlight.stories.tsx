import type { Story } from "@ladle/react";
import { InspectHighlight } from "./InspectHighlight";

// InspectHighlight is the devtools-style dashed outline + element tag that the
// page draws over the value the cursor is hovering, just before the click locks
// it in. On the page BrowserWindow passes the measured target rect (cg.target);
// here we feed a fixed rect standing in for the "Solicitation Type" value cell.
// It's only visible in a narrow window (~p 0.225-0.29); default p 0.26.
export default { title: "Forge/Browser" };

const TARGET = { x: 250, y: 250, w: 170, h: 30 };

export const InspectOverlay: Story<{ p: number }> = ({ p }) => (
  <div
    className="relative overflow-hidden border-2 border-black bg-white"
    style={{ width: 600, height: 420 }}
  >
    {/* a faux value cell sitting where the highlight lands, for context */}
    <div
      className="absolute flex items-center px-3 text-sm"
      style={{ left: TARGET.x, top: TARGET.y, width: TARGET.w, height: TARGET.h }}
    >
      Request for Proposal
    </div>
    <InspectHighlight p={p} target={TARGET} />
  </div>
);
InspectOverlay.args = { p: 0.26 };
InspectOverlay.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
