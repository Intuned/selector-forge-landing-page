import { useRef } from "react";
import type { Story } from "@ladle/react";
import { FloatingForge } from "./FloatingForge";

// The POPUP element. FloatingForge is the extension popup that drops from the
// toolbar icon. It animates through distinct states keyed to the scroll
// progress `p`; each gets its own story here. On the landing page BrowserWindow
// supplies the live `isList` flag and the `pickRef` it measures to aim the
// cursor at the "Pick element" button — here we stub the ref and set isList per
// state. Frame mimics the relative browser the popup positions itself within.
export default { title: "Forge/Browser" };

const Popup = ({ p, isList }: { p: number; isList: boolean }) => {
  const pickRef = useRef<HTMLButtonElement>(null);
  return (
    <div
      className="relative overflow-hidden border-2 border-black bg-white"
      style={{ width: 780, height: 440 }}
    >
      <FloatingForge p={p} isList={isList} pickRef={pickRef} />
    </div>
  );
};

// CHOICE — single vs list radios + "Pick element" (before the page click).
export const PopupChoice: Story = () => <Popup p={0.14} isList={false} />;

// SELECTING — the inspect crosshair, "Point at any element" (after Pick element).
export const PopupSelecting: Story = () => <Popup p={0.24} isList={false} />;

// JUDGED (element) — the typed XPath, RELIABLE badge, "anchored to label", copy.
export const PopupJudgedElement: Story = () => <Popup p={0.4} isList={false} />;

// JUDGED (list) — the generalized list selector, "any count", N matches.
export const PopupJudgedList: Story = () => <Popup p={0.7} isList={true} />;

// Scrub `p` (popup is present from ~0.10) and toggle isList to see every state.
export const PopupInteractive: Story<{ p: number; isList: boolean }> = ({
  p,
  isList,
}) => <Popup p={p} isList={isList} />;
PopupInteractive.args = { p: 0.14, isList: false };
PopupInteractive.argTypes = {
  p: { control: { type: "range", min: 0, max: 1, step: 0.005 } },
  isList: { control: { type: "boolean" } },
};
