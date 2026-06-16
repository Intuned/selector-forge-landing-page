import { useRef } from "react";
import type { Story } from "@ladle/react";
import { GovPage } from "./GovPage";

// The CONTENT element. GovPage is the single gov solicitation page (Details +
// Files) that lives inside the BrowserWindow content viewport (absolute
// inset-0). It scrolls itself to the Files section for the LIST beat and draws
// the acid element-anchor (lock-frame on the label, match-fill on the value,
// curved connector between them). On the page BrowserWindow owns `targetRef`;
// here we supply a throwaway ref. Frame mimics the clipped browser viewport.
export default { title: "Forge/Browser" };

const Content = ({ p }: { p: number }) => {
  const targetRef = useRef<HTMLElement>(null);
  return (
    <div
      className="relative overflow-hidden border-2 border-black bg-white"
      style={{ width: 780, height: 560 }}
    >
      <GovPage p={p} targetRef={targetRef} />
    </div>
  );
};

// DETAILS — the plain solicitation page before any selector is anchored.
export const ContentDetails: Story = () => <Content p={0.1} />;

// ANCHORED — acid lock-frame + match-fill + the connector tying value to label.
export const ContentAnchored: Story = () => <Content p={0.34} />;

// FILES — the page scrolled down to the Files section, rows lit one by one.
export const ContentFiles: Story = () => <Content p={0.64} />;

// Scrub `p` through the whole page sequence.
export const ContentInteractive: Story<{ p: number }> = ({ p }) => (
  <Content p={p} />
);
ContentInteractive.args = { p: 0.34 };
ContentInteractive.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
};
