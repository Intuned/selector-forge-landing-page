# Selector Forge — landing page

Marketing site for **Selector Forge**, a Chrome & Firefox extension that generates
selectors which are stress-tested against the page and certified before you ever
see them. _Forged, not copied._

The centerpiece is a single, scroll-driven "in-browser" hero that scrubs through the
product story as you scroll — **PICK** an element → generalize to the whole **LIST** →
**SHIP** the result — all rendered as one continuous animation driven by a single
scroll-progress value.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com) (configured via `@theme` in `app/globals.css`)
- TypeScript
- [Ladle](https://ladle.dev) for isolated component previews

## Getting started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000). Edit `app/page.tsx` to change what renders.

| Script | What it does |
| --- | --- |
| `yarn dev` | Next dev server (Turbopack) |
| `yarn build` / `yarn start` | Production build / serve |
| `yarn lint` | ESLint |
| `yarn ladle` | Component previews at [http://localhost:61000](http://localhost:61000) |
| `yarn ladle:build` / `yarn ladle:preview` | Static Ladle build / serve it |

## Environment variables

Analytics is [PostHog](https://posthog.com), wired client-side (the site is a static
export, so there's no server runtime). Copy `.env.example` to `.env.local` and fill in:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY` | to enable tracking | Project API key. **Leave blank to keep analytics dormant** — the site runs fine unconfigured (local dev / previews), it just captures nothing. |
| `NEXT_PUBLIC_POSTHOG_HOST` | no | Ingestion endpoint. Defaults to US cloud (`https://us.i.posthog.com`); use `https://eu.i.posthog.com` for EU cloud. |

Both must keep the `NEXT_PUBLIC_` prefix so they inline into the client bundle. PostHog
auto-captures UTM params (`utm_campaign`, …) from the URL, and the "GET NOTIFIED" forms
fire a `cli_waitlist_signup` event + identify the person by email — so waitlist signups
can be broken down by campaign in PostHog.

## Project structure

```
app/                                  Next App Router (page, layout, globals.css, favicon assets)
components/magicpath/
  forge-element-list-in-browser/      the live hero
    ForgeElementListInBrowser.tsx     root: LeftColumn (manifesto) + RightColumn (scroll stage)
    components/                        RightColumn, browser mock, popup, ship stage, logo, …
    components/mobile/                 phone-width retellings of the same beats
    shared/                            tokens, constants, math, page data
*.stories.tsx                         co-located Ladle stories
```

The scroll engine lives in `RightColumn.tsx`: a single `p` (0→1) progress value, eased
from a global wheel/scroll listener, drives every child — no per-element scroll math.

## Design system

- **One accent, swappable from one place.** The primary accent is the CSS variable
  `--forge-primary` in `app/globals.css` (acid green by default). The `ACID` token in
  `shared/tokens.ts` is `var(--forge-primary)`, and translucent tints derive from it via
  `color-mix()` — change that one line to retheme the whole site. Everything else is
  ink (`#0B0B0B`), white, and neutral greys. Keep it a single accent.
- **Brutalist boxes.** Hard offset shadows, 2px borders, square corners, uppercase mono.
- **Brand mark.** The anvil (forge → "Forged, not copied"). Favicon assets live in `app/`
  (`icon.svg`, `favicon.ico`, `apple-icon.png`); standalone tiles are in `public/`
  (`forge-icon-24.svg` and a knockout `forge-icon-24-cutout.svg`). The recolorable
  `ForgeMark` / `ForgeIcon` components are in `components/.../components/ForgeLogo.tsx`.

> The `.claude` ⇄ `.agents` and `CLAUDE.md` ⇄ `AGENTS.md` symlinks are recreated by the
> `postinstall` script.
