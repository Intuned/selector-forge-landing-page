import type { Story } from "@ladle/react";
import { ForgeMark, ForgeIcon } from "./ForgeLogo";
import { ACID, INK, MONO } from "../shared/tokens";

// The Selector Forge brand mark — an anvil (forge → "Forged, not copied.").
// Two forms ship: ForgeMark (the glyph alone, recolored to acid inside the
// dark wordmark pill) and ForgeIcon (the squared app/favicon tile). Kept to the
// single-accent palette: acid on ink, never the original orange.
export default { title: "Forge/ForgeLogo" };

// WORDMARK LOCKUP — exactly as it sits in the LeftColumn / mobile hero: an acid
// anvil tucked into the black "selector-forge" pill.
export const Wordmark: Story = () => (
  <span
    className="inline-flex items-center gap-2 bg-black px-2.5 py-1.5 text-white"
    style={{ fontFamily: MONO, fontWeight: 700, fontSize: "14px", letterSpacing: "-0.02em" }}
  >
    <ForgeMark fill={ACID} aria-hidden style={{ height: 15, width: "auto", display: "block" }} />
    selector-forge
  </span>
);

// SQUARED ICON — the favicon/app tile (acid anvil on ink) at a few sizes.
export const Icon: Story = () => (
  <div style={{ display: "flex", gap: 16, alignItems: "flex-end" }}>
    <ForgeIcon size={128} />
    <ForgeIcon size={64} />
    <ForgeIcon size={48} />
    <ForgeIcon size={32} />
    <ForgeIcon size={16} />
  </div>
);

// MARK — the glyph alone, driven by currentColor, on ink and on acid.
export const Mark: Story = () => (
  <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
    <div style={{ background: INK, padding: 24, color: ACID }}>
      <ForgeMark style={{ height: 48, width: "auto" }} />
    </div>
    <div style={{ background: ACID, padding: 24, color: INK }}>
      <ForgeMark style={{ height: 48, width: "auto" }} />
    </div>
  </div>
);
