import type { Story } from "@ladle/react";
import { LeftColumn } from "./LeftColumn";

// In the landing page LeftColumn is the fixed 40%-width manifesto rail that
// never scrolls (the root renders it in `<div class="h-full w-[40%]">`). It
// takes no props. Shown here at a representative column width and full height.
export default { title: "Forge/Components" };

export const Manifesto: Story = () => (
  <div className="h-screen border-r-2 border-black" style={{ width: 560 }}>
    <LeftColumn />
  </div>
);
