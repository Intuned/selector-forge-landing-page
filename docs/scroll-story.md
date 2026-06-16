# Selector Forge — Landing Scroll Story

Design document for the interactive landing·
In-Browser."** It explains the scroll-driven narrative, each step, and how every
transition is built. This is the behavioral spec; the source is the source of truth.

---

## The big idea

The page tells **one story in one continuous scroll**: *a developer opens the
selector-forge extension on a real gov procurement page, picks a value, watches it
anchor to its label, then picks the whole file list, and ships.* The thesis —
"Forged, not copied; the brittle ones never survive" — is shown as a live demo, not
claimed in copy.

The screen is split:

- **Left (40%) — the manifesto.** Fixed. Never scrolls. Wordmark, headline, pitch,
  "Add to Chrome" / "View on GitHub", trust stamps. It's the constant brand frame.
  The **`FREE TIER` stamp is a hover/focus popover** (`FreeTierStamp.tsx`, built on
  Radix HoverCard — focus, hover grace-area, and collision-aware positioning come
  free, and it portals out of the column so nothing clips it): the chip stays a
  single calm word, and hovering reveals the honest freemium model — 200
  selectors/mo free, unlimited on any paid Intuned plan, open source extension +
  selectors forged in the Intuned cloud. (Touch has no hover, so `MobileHero.tsx`
  drops the popover and states that model as an inline line instead.)
- **Right (60%) — the stage.** A mock browser window that *plays* the demo as you
  scroll. This is where the entire story happens. The window **fills the available
  stage** (no fixed max-width) so it grows with the screen; the gov page inside it
  lays its content in a **left lane that reserves a fixed right gutter** (`POPUP_GUTTER`
  in `GovPage.tsx`) for the floating extension popup, so the content widens with the
  window while the popup never overlaps it.

---

## How the scroll engine works

Everything on the right is a **pure function of a single scroll progress value
`P ∈ [0, 1]`**. There are no timers and no "play" button — the user's scroll *is* the
clock.

- The right column is an internal `overflow-y-auto` scroller with a **480vh track**
  and a **sticky 100vh stage**. As you scroll the 480vh, the stage stays pinned and
  `P = scrollTop / (trackHeight − viewport)`.
- Every animated property (opacity, transform, a typed selector's character count,
  an SVG path's draw) is computed from `P` via a few math helpers. Because it's pure,
  the story is **fully reversible** — scroll up and it plays backwards, frame-exact.

### The transition vocabulary

All motion is built from five primitives. Knowing these five explains every
transition in the piece:

| Primitive | What it does | Used for |
|---|---|---|
| `seg(P, a, b)` | eased 0→1 ramp between `a` and `b` (ease-in-out) | travel, draws, slides, rises |
| `band(P, a, b)` | fade **in then out** — visible only inside `[a, b]` | anything that appears then leaves (captions, highlights, popup states) |
| `segLin(P, a, b)` | linear 0→1 ramp | "typing" a selector character-by-character |
| `lerp` / `lerpPt` | interpolate a number / an (x,y) point | cursor position, page scroll offset, fills |
| `strokeDashoffset` | reveal an SVG path along its length | the anchor connector "drawing" itself |

Two rules that keep it clean:

1. **Crossfading states must overlap.** When one popup state hands off to the next
   (CHOICE → SELECTING → JUDGED), their `band` windows overlap by a few hundredths of
   `P`. If they merely touch, the popup body blanks for a frame at the seam.
2. **The cursor drives to *measured* anchors.** The extension icon, the "Pick
   element" button, and the target value are measured live
   (`getBoundingClientRect`), so the cursor lands exactly on them at any window size.

---

## The story, step by step

`P` windows are approximate edges; see the source constants (`W_ICON = 0.092`,
`W_PICK = 0.205`, `W_TARGET = 0.285`, `EL_B = 0.46`, `LIST_A = 0.52`, `LIST_B = 0.82`,
`SHIP_A = 0.87`) for exact values.

### 1 · Page only — the cold open · `P 0.00 – 0.04`
Just the gov page inside a calm browser frame (one chrome bar: traffic dots, a wide
omnibox URL, the extension button). **No popup, no cursor.** The "scroll ↓" hint
pulses at the bottom.
*Transition out:* the cursor and a "click selector-forge to start" callout fade in
(`band`) as the cursor begins to move.

### 2 · Click the extension · `P 0.04 – 0.10`
The cursor **travels** to the extension icon at the top-right of the chrome bar
(`seg 0.04→0.085`, a `lerpPt` along the path) while the icon gently pulses. At
`P ≈ 0.092` it **clicks**: the icon presses in (scale-down) and a ripple ring expands
(`segLin` over a ~0.02 window, fading as it grows).
*Why:* the earlier version never showed *that you click the extension*. Now the cause
is explicit.

### 3 · Popup opens — choose a mode · `P 0.10 – 0.205`
The popup **drops from the icon** (`present = (P−0.10)/0.035`, an 8px slide + fade,
caret pointing up at the button). It shows the CHOICE state: usage meter, "Single
element" (active) / "List of items", and a big "Pick element" button. The cursor
moves down toward that button (`seg 0.14→0.19`).

### 4 · Pick element · `P ≈ 0.205`
The cursor **clicks "Pick element"** (ripple + button press). The popup begins
crossfading CHOICE → SELECTING.

### 5 · Select the value (the crosshair) · `P 0.205 – 0.285`
The cursor **morphs from arrow to crosshair** (`seg 0.215→0.235` crossfade) and
travels onto the page toward the target value. As it hovers:
- the popup shows **SELECTING**: a crosshair + "Point at any element / hover the page
  · forge judges it live";
- the value gets a **devtools-style dashed outline** with acid corner ticks, a tag
  reading `dd · Solicitation Type`, and a **"click to anchor"** hint by the crosshair
  (all `band`-gated to this window).
*Why:* makes it unmistakable that the crosshair **is the user picking the element**.

### 6 · Anchor — the payoff · `P 0.285 – 0.46`
At `P ≈ 0.285` the cursor **clicks the value** (ripple). Then, in sequence:
- the **label** ("Solicitation Type") gets an acid lock-frame (`band 0.29→`);
- the **value** fills acid (`band 0.305→`, with a `scaleX` grow);
- the **connector draws** from label → value — a slim acid line (black-edged so it
  stays legible over the acid value fill) with a small arrowhead and a shallow bow,
  revealed via `strokeDashoffset` (`seg 0.305→0.43`);
- the popup flips to **JUDGED**: the XPath selector *types in* (`segLin`) with a
  blinking caret, then a "RELIABLE · anchored to label" chip + "copy selector";
- an **"anchored to the label" chip** appears on the page, positioned in the **left
  lane just below the anchored value** (measured from the `dd` cell, clear of the
  top-right popup) and held for most of the element beat (`band 0.305→0.46`) so it
  stays on screen long enough to read.
*Caption:* "ANCHORED TO THE LABEL — the selector ties to its label, not its position."
The cursor rests on the value, then fades (`band` out by ~0.40).

### 7 · Switch to LIST + scroll to the files · `P 0.46 – 0.58`
The segmented control's indicator **slides** from ELEMENT → LIST (`seg 0.47→0.53`).
The browser's **page content scrolls down** (`translateY`, `seg 0.47→0.58`) so the
Files section comes into focus — Status/Due Date peek at the top, the URL flips to
`…/view#files`. Details and Files are **one continuous page**; nothing is swapped out.

### 8 · Pick one file, get them all · `P 0.58 – 0.82`
The popup re-opens in list mode (CHOICE → JUDGED for the list selector). The cursor
picks the first file, then the file rows **ignite acid one-by-one** (`seg`-staggered
per row), each ending with a ✓. The popup shows the list selector + "RELIABLE · any
count · 5 matches · whole set."
*Caption:* "OR THE WHOLE LIST — scroll to the files, pick one — get every file, any
count."

### 9 · Ship — "Every selector, judged." · `P 0.87 – 1.00`
The browser **crossfades out** and the closing stage **rises in** (`seg` fade +
`translateY`). Two dark code cards prove the output is real: **01 Playwright test**
(`locator(...).textContent()` → ✓ PASS, "1 passed (0.4s)") and **02 Scraper** (clean
JSON → "anchored — the right field, every time"). Then the CTAs: "Add to Chrome" /
"View on GitHub", a "CLI — COMING SOON" strip (`npx intuned forge pick` + an email
capture), and a "Why Static Selectors Fail →" link.

---

## Persistent chrome (always on the stage)

- **Progress rail** (right edge): a vertical track that fills acid by `P`, with ticks
  **INTRO · ELEMENT · LIST · SHIP** that light as they're passed.
- **Caption bar** (bottom): one eyebrow pill + line per beat, each `band`-gated so
  only the active beat's caption shows.
- **Segmented control** (top): ELEMENT · LIST, the live "mode" indicator.

## Look & feel

Light brutalist: 2px black borders, hard zero-radius offset shadows, dot-grid
background. **Acid green `#C8FF2E` is the only accent** (no red, no orange) on ink
`#0B0B0B`. Type: Bricolage Grotesque (headings), Archivo (body), Space Mono (code /
labels). The browser frame's macOS dots are kept monochrome (two white + one acid) to
hold the acid-only palette rather than using real traffic-light colors.

**Design tokens.** Two scales keep sizing from drifting across components: the
**box tiers** (`TIER_CTA/CONTROL/BADGE` in `shared/tokens.ts`) fix button/badge
font + shadow per role, and the **type scale** lives in Tailwind v4 `@theme`
(`app/globals.css`) as `--text-*` tokens applied via utilities — `text-title` ·
`text-heading` · `text-lead` · `text-body` · `text-small` · `text-label` ·
`text-badge` · `text-micro` · `text-nano`, plus responsive `text-display*` for the
hero/closer headlines. Use those utility classes for font sizes; only
scroll-driven / computed styles (opacity, transform, typed-char counts) stay
inline. Interactive primitives that need real focus/dismiss/positioning behavior
(e.g. the `FREE TIER` popover) use unstyled Radix, styled brutalist.

## Authoring notes

- The whole demo is reversible and scrubbable — to QA any beat, set the internal
  scroller's `scrollTop` to `fraction × maxScroll` and the stage renders that `P`.
- Popup state windows **must overlap** at every handoff (see transition rule 1).
- Cursor / inspect targets are **measured, not hardcoded** — they survive resizes.
- The browser window **fills the stage** and the gov page content lives in a left lane
  sized as `100% − POPUP_GUTTER` (capped at `LANE_MAX`), so the page adapts to the
  window width without ever sliding under the popup. Tune `POPUP_GUTTER` / `LANE_MAX`
  in `GovPage.tsx` if the popup width or the desired content width changes.
- The browser is **centered in a stage that reserves a fixed top/bottom band**
  (`height: min(880px, calc(100% − 200px))` in `RightColumn.tsx`) so it never grows
  into the segmented control (pinned `top-8`) or the caption (pinned `bottom-7`),
  which are absolutely positioned overlays — at any viewport height it keeps ≥100px
  clear on each side.
- It is currently a **fixed desktop** layout (40/60 split, sticky 100vh stage). A
  production port needs a real mobile story (the scroll stage doesn't collapse on its
  own).
