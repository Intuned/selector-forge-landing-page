"use client";

import { useEffect, useState, type ComponentType } from "react";

/**
 * Dev-only mount of the Agentation visual-feedback toolbar (https://agentation.com).
 *
 * Agentation lets you click elements in the running app, jot a note, and copy
 * structured markdown (selectors, element paths, computed styles) to hand to an
 * AI coding agent. It's a *developer* tool — mounted both in the Next app (from
 * app/layout.tsx) and in Ladle (from .ladle/components.tsx) — and should never
 * reach a production build's visitors or bloat its bundle, so:
 *
 *   - `agentation` is a devDependency, and
 *   - it is pulled in via a guarded dynamic `import()`. That import is code-split
 *     into its own chunk which is only ever fetched in development. The host
 *     bundler (Next's `next build`, Ladle's Vite `ladle build`) statically
 *     replaces `process.env.NODE_ENV`, so in any production build this component
 *     compiles down to a no-op that renders `null` and never loads the widget.
 *
 * The dynamic import also keeps the browser-only toolbar (portals, `window`,
 * `localStorage`) out of SSR — it mounts after the effect runs on the client.
 */
export function AgentationDevTools() {
  const [Toolbar, setToolbar] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    let active = true;
    import("agentation")
      .then((mod) => {
        if (active) setToolbar(() => mod.Agentation as ComponentType);
      })
      .catch(() => {
        // The toolbar is a dev convenience; never break the app if it can't load.
      });

    return () => {
      active = false;
    };
  }, []);

  return Toolbar ? <Toolbar /> : null;
}
