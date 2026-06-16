import type { Story } from "@ladle/react";
import { SegmentedControl } from "./SegmentedControl";

// On the landing page SegmentedControl sits pinned at the top of the right-hand
// stage (`absolute top-8`), above the browser mock. Its ELEMENT/LIST indicator
// slides as the scroll crosses the LIST beat (~p 0.47-0.53). Scrub `p`: below
// ~0.5 = ELEMENT active, above = LIST active.
export default { title: "Forge/Components" };

export const ElementListToggle: Story<{ p: number }> = ({ p }) => (
  <div className="flex w-full justify-center bg-white p-10">
    <SegmentedControl p={p} />
  </div>
);
ElementListToggle.args = { p: 0.2 };
ElementListToggle.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
