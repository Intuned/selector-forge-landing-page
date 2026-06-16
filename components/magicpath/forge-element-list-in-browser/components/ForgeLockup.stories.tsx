import type { Story } from "@ladle/react";
import { ForgeMark, ForgeIcon, ANVIL_PATHS } from "./ForgeLogo";
import { ACID, INK, MONO } from "../shared/tokens";

/* Placement options for bringing the squared "forge icon" tile into the header
   brand lockup. Rendered on the page's white dot-grid so they read in context.
   Pick one and I'll wire it into LeftColumn + MobileHero. */
export default { title: "Forge/Lockup" };

const TILE = 28; // header mark size (≈ pill height)
const TIGHT = 2 / 24; // the 2px-padding ratio we finalized on the 24px icon

const dotGrid: React.CSSProperties = {
  backgroundImage: "radial-gradient(rgba(0,0,0,0.04) 1.4px, transparent 1.4px)",
  backgroundSize: "18px 18px",
};

// A cutout (knockout) tile: acid square with the anvil punched through to the
// page behind it. Local to the story so it doesn't touch the shared component.
const CutTile: React.FC<{ size?: number; bg?: string }> = ({ size = TILE, bg = ACID }) => {
  const markW = size * (1 - TIGHT * 2);
  const markH = (markW * 41) / 72;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} xmlns="http://www.w3.org/2000/svg" aria-label="Selector Forge">
      <defs>
        <mask id="lockup-cut">
          <rect width={size} height={size} fill="#fff" />
          <g fill="#000" transform={`translate(${(size - markW) / 2} ${(size - markH) / 2}) scale(${markW / 72})`}>
            {ANVIL_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </mask>
      </defs>
      <rect width={size} height={size} fill={bg} mask="url(#lockup-cut)" />
    </svg>
  );
};

const wordPlain = (
  <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 16, color: INK, letterSpacing: "-0.02em" }}>
    selector-forge
  </span>
);
const wordPill = (
  <span
    className="inline-flex items-center bg-black px-2.5 py-1.5 text-white"
    style={{ fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}
  >
    selector-forge
  </span>
);

const Row: React.FC<{ tag: string; note: string; children: React.ReactNode }> = ({ tag, note, children }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
    <span style={{ fontFamily: MONO, fontWeight: 700, fontSize: 11, letterSpacing: "0.08em", color: "#9ca3af", textTransform: "uppercase" }}>
      {tag} · <span style={{ color: "#6b7280", textTransform: "none", letterSpacing: 0 }}>{note}</span>
    </span>
    <div className="flex items-center" style={{ gap: 10, minHeight: 40 }}>{children}</div>
  </div>
);

// All candidate header lockups stacked for comparison.
export const Options: Story = () => (
  <div style={{ ...dotGrid, background: "#fff", minHeight: "100vh", padding: 48 }}>
    <div style={{ display: "flex", flexDirection: "column", gap: 34, maxWidth: 560 }}>
      <Row tag="now" note="current — anvil glyph tucked inside the black pill">
        <span className="inline-flex items-center gap-2 bg-black px-2.5 py-1.5 text-white" style={{ fontFamily: MONO, fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}>
          <ForgeMark fill={ACID} aria-hidden style={{ height: 15, width: "auto", display: "block" }} />
          selector-forge
        </span>
      </Row>

      <Row tag="A" note="icon tile + black wordmark pill">
        <ForgeIcon size={TILE} bg={ACID} fg={INK} inset={TIGHT} />
        {wordPill}
      </Row>

      <Row tag="B" note="icon tile + plain wordmark (no pill)">
        <ForgeIcon size={TILE} bg={ACID} fg={INK} inset={TIGHT} />
        {wordPlain}
      </Row>

      <Row tag="C" note="ink tile / acid anvil (favicon treatment) + plain wordmark">
        <ForgeIcon size={TILE} bg={INK} fg={ACID} inset={TIGHT} />
        {wordPlain}
      </Row>

      <Row tag="D" note="cutout tile (anvil knocked through) + plain wordmark">
        <CutTile size={TILE} />
        {wordPlain}
      </Row>

      <Row tag="E" note="feature mark — larger standalone tile">
        <ForgeIcon size={64} bg={ACID} fg={INK} inset={TIGHT} />
      </Row>
    </div>
  </div>
);
