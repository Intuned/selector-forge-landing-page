import type { Story } from "@ladle/react";
import { IntunedLogo } from "./IntunedLogo";
import { INTUNED, BODY } from "../shared/tokens";

// The "Powered by Intuned" credit logo. The landing page renders it in the
// FULL BRAND colors (orange→crimson cube) — the one allowed exception to the
// page's single-accent palette, kept for brand recognition. A mono variant is
// also exposed for surfaces where a single ink color is wanted.
export default { title: "Forge/IntunedLogo" };

// BRAND — the original orange→crimson cube + ink lettering. This is what ships.
export const BrandColor: Story = () => (
  <IntunedLogo mono={false} style={{ height: 28, width: "auto" }} />
);

// As it appears in the LeftColumn footer: brand-color logo beside a muted label.
export const FooterCredit: Story = () => (
  <a
    href={INTUNED}
    target="_blank"
    rel="noopener noreferrer"
    className="group inline-flex select-none items-center gap-2.5 text-gray-400 transition-colors duration-150 hover:text-black"
    style={{ fontFamily: BODY, fontSize: "13px" }}
  >
    <span>Powered by</span>
    <IntunedLogo mono={false} aria-label="Intuned" style={{ height: 26, width: "auto", display: "block" }} />
  </a>
);

// MONO — inherits currentColor (single ink color), for reference.
export const Mono: Story = () => (
  <div style={{ color: "#0B0B0B" }}>
    <IntunedLogo style={{ height: 28, width: "auto" }} />
  </div>
);
