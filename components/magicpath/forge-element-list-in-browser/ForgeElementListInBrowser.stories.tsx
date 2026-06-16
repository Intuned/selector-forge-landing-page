import type { Story } from "@ladle/react";
import { ForgeElementListInBrowser } from "./ForgeElementListInBrowser";

// Keep the title to a single segment with no `&`/`·`/spaced-`/`: Ladle slugifies
// the title and splits the slug on `--` to build the nav tree, so those
// characters would spawn spurious extra levels.
export default {
  title: "Forge",
};

// The hero is a self-contained, full-viewport scroll-story (h-screen w-screen),
// so it's best viewed via Ladle's fullscreen/preview toggle. Scroll inside the
// right column to drive it through its INTRO → ELEMENT → LIST → SHIP beats.
export const ElementListInBrowser: Story = () => <ForgeElementListInBrowser />;
