import type { Story } from "@ladle/react";
import { RightColumn } from "./RightColumn";

// RightColumn is the 60%-width scroll engine: it owns the scroll-progress `p`
// and drives the whole INTRO -> ELEMENT -> LIST -> SHIP story. It takes no
// props and manages its own internal scroll, so here it just needs a viewport
// height to scroll within. Scroll inside it to drive the animation, exactly as
// on the landing page. (Best viewed via Ladle's fullscreen / &mode=preview.)
export default { title: "Forge/Components" };

export const ScrollStage: Story = () => (
  <div className="h-screen w-full">
    <RightColumn />
  </div>
);
