import type { ReactNode } from "react";
import type { Story } from "@ladle/react";
import { ProgressRail } from "./ProgressRail";

// ProgressRail is the vertical scroll-progress rail pinned to the right edge of
// the stage (`absolute right-4 top-1/2 h-[62%]`). Its acid fill grows with `p`
// and its INTRO/ELEMENT/LIST/SHIP ticks light as each is passed. Scrub `p`.
export default { title: "Forge/Components" };

const Stage = ({ children }: { children: ReactNode }) => (
  <div className="relative h-screen w-full overflow-hidden bg-white">
    {children}
  </div>
);

export const ScrollProgress: Story<{ p: number }> = ({ p }) => (
  <Stage>
    <ProgressRail p={p} />
  </Stage>
);
ScrollProgress.args = { p: 0.5 };
ScrollProgress.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
