import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { CaptionBar } from "./CaptionBar";

// CaptionBar is the eyebrow-pill + line that sits at the bottom of the right
// stage (`absolute bottom-7`), one beat per scroll phase. It cross-fades
// between three beats: PICK ANY ELEMENT (~0.04-0.30), ANCHORED TO THE LABEL
// (~0.31-0.46), OR THE WHOLE LIST (~0.52-0.82). Scrub `p` to move between them.
export default { title: "Forge/Components" };

// Mimic the relative, full-bleed stage CaptionBar is positioned within.
const Stage = ({ children }: { children: ReactNode }) => (
  <div
    className="relative h-[420px] w-full overflow-hidden bg-white"
    style={{
      backgroundImage:
        "radial-gradient(rgba(0,0,0,0.025) 1.4px, transparent 1.4px)",
      backgroundSize: "18px 18px",
    }}
  >
    {children}
  </div>
);

export const BeatCaptions: Story<{ p: number }> = ({ p }) => (
  <Stage>
    <CaptionBar p={p} />
  </Stage>
);
BeatCaptions.args = { p: 0.1 };
BeatCaptions.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
