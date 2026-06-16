---
name: ladle
description: Use when developing, previewing, or writing stories for React components in isolation with Ladle in this repo — starting the Ladle dev server, building/previewing the static Ladle site, adding a `*.stories.tsx` file, or debugging a story whose Tailwind classes or fonts are missing. Covers this project's wiring (custom config because there's no `src/` dir, the Provider that injects `globals.css` + Google Fonts), the npm scripts, and gotchas for full-viewport components and story titles.
metadata:
  version: "1.0.0"
user-invocable: true
---

# Ladle

[Ladle](https://ladle.dev) renders React components in isolation — a fast, Vite-based
alternative to Storybook. It is wired up in this repo to preview the components under
`components/` (e.g. the MagicPath landing hero) outside of Next.js.

## Commands

Run via the package.json scripts (they're namespaced so they don't collide with
Next's `dev`/`build`/`start`):

```bash
yarn ladle          # dev server with HMR → http://localhost:61000
yarn ladle:build    # static production build into ./build (gitignored)
yarn ladle:preview  # serve the production build locally
```

The dev server does **not** auto-open a browser and has no `--no-open` flag. Pass
Ladle flags after the script, e.g. `yarn ladle --port 6006`.

## Writing a story

Stories are co-located with components and must match the glob
`{app,components}/**/*.stories.{js,jsx,ts,tsx,mdx}` (configured in
`.ladle/config.mjs` — Ladle's default is `src/**`, which this repo doesn't have).

A story file is a default export (with a `title`) plus one named export per story:

```tsx
import type { Story } from "@ladle/react";
import { MyComponent } from "./MyComponent";

export default { title: "Group" };

export const Basic: Story = () => <MyComponent />;
```

The named export is the story; its camelCase name becomes the label
(`Basic` → "Basic"). The `title` builds the left-nav tree.

## How styles & fonts reach a story

Ladle is a standalone Vite app — it does **not** run Next's `app/layout.tsx`, so
anything the layout provides must be re-supplied. That's what `.ladle/components.tsx`
(the Ladle `Provider`) does for every story:

- `import "../app/globals.css";` → Tailwind v4 **and** the `forge*` `@keyframes`.
  Tailwind/PostCSS run automatically because Vite picks up `postcss.config.mjs`.
- a `useEffect` injects the Google Fonts `<link>` (Space Mono, Bricolage Grotesque,
  Archivo) — the same href as in `app/layout.tsx`.

If a story's utility classes or fonts look wrong, check that file first.

## Gotchas

- **Full-viewport components** (e.g. the landing hero is `w-screen h-screen`) overflow
  Ladle's inline canvas because `100vw` includes the sidebar. View them full-bleed via
  the fullscreen toggle in the bottom toolbar, or append `&mode=preview` to the story
  URL. Don't hack the component's sizing to fit Ladle.
- **Story titles**: Ladle slugifies the `title` and splits the slug on `--` to build
  the nav tree, so `&`, `·`, and a space-padded ` / ` spawn spurious extra levels. Keep
  titles to plain words + single spaces (and a single `/` for one level of grouping).
- The `build/` output dir is already in `.gitignore` — don't commit it.

## Files

- `.ladle/config.mjs` — story glob + dev-server port.
- `.ladle/components.tsx` — the `Provider` (global CSS + fonts).
- `components/**/*.stories.tsx` — the stories themselves.
