// Ladle wraps every story with this Provider. Next's `app/layout.tsx` does two
// things the stories also need, and which Ladle (a standalone Vite app) does
// not get for free:
//   1. the global stylesheet — Tailwind plus the `forge*` @keyframes the hero
//      component references by name from inline styles;
//   2. the Google Font families ('Space Mono', 'Bricolage Grotesque',
//      'Archivo') the component names literally in inline `fontFamily` styles.
import type { GlobalProvider } from "@ladle/react";
import { useEffect } from "react";
import "../app/globals.css";
import { AgentationDevTools } from "../components/dev/AgentationDevTools";

// Same href as the <link> in app/layout.tsx — kept in sync so stories render
// with identical typography to the live page.
const FORGE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700;12..96,800&family=Space+Mono:wght@400;700&display=swap";

export const Provider: GlobalProvider = ({ children }) => {
  useEffect(() => {
    if (document.getElementById("forge-fonts")) return;
    const link = document.createElement("link");
    link.id = "forge-fonts";
    link.rel = "stylesheet";
    link.href = FORGE_FONTS_HREF;
    document.head.appendChild(link);
  }, []);

  return (
    <>
      {children}
      {/* Dev-only Agentation toolbar — present during `ladle serve`, tree-shaken
          out of `ladle build` (same dev-only wrapper the Next app uses). */}
      <AgentationDevTools />
    </>
  );
};
