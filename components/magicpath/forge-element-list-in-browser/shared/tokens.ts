// The single primary accent. Resolves to the `--forge-primary` CSS variable
// (declared in app/globals.css), so changing that one line rethemes the whole
// site — every `background: ACID`, `boxShadow: …${ACID}`, and SVG `fill={ACID}`
// follows it, as do the translucent acid tints (built with color-mix on ACID).
// It's used as a plain CSS color value everywhere, so `var(--…)` is valid in
// every spot ACID is interpolated. Keep it a SINGLE accent — never add a second.
const ACID = 'var(--forge-primary)';
const INK = '#0B0B0B';
const MONO = "'Space Mono', monospace";
const HEAD = "'Bricolage Grotesque', sans-serif";
const BODY = "'Archivo', sans-serif";
const GITHUB = 'https://github.com/Intuned/selector-forge';
// Extension store listings. The install CTA swaps between them based on the
// visitor's browser (see shared/useInstallTarget) — Firefox gets FIREFOX, every
// other browser gets CHROME.
const CHROME = 'https://chromewebstore.google.com/detail/selector-forge-ai-selecto/lbendfnlmhdakbeblajoffkfmafbfaha';
const FIREFOX = 'https://addons.mozilla.org/en-US/firefox/addon/selector-forge/';
const INTUNED = 'https://intunedhq.com';
const INTUNED_PRICING = 'https://intunedhq.com/pricing';
// "Why Static Selectors Fail" deep-dive post.
const BLOG = 'https://intunedhq.com/blog/selector-forge';
const SEL_ELEMENT = "//dt[normalize-space()='Solicitation Type']/following-sibling::dd";
const SEL_LIST = "//div[contains(@class, 'section') and .//h2[normalize-space()='Solicitation Files']]//a[contains(@href, '/files/')]";

/* ----------------------------------------------------------------------------
   Brutalist box tiers — keep buttons/badges visually consistent within a role
   so their sizes/shadows don't drift across components. Prominence ranks
   CTA > control > badge. `font` is the px label size; `shadow` is the px offset
   of the hard drop shadow (build the box-shadow as `${shadow}px ${shadow}px 0 0
   <color>`). Same tier ⇒ same height/padding/font/shadow.
     CTA     — primary calls to action (Add to Chrome, View on GitHub)
     CONTROL — interactive controls (segmented toggle, popup Pick/copy buttons)
     BADGE   — small status chips (FREE/OPEN SOURCE stamps, caption eyebrow)
   ---------------------------------------------------------------------------- */
const TIER_CTA = { font: 15, shadow: 6 } as const;
const TIER_CONTROL = { font: 12, shadow: 4 } as const;
const TIER_BADGE = { font: 11, shadow: 2 } as const;

/* TYPE SCALE — the text counterpart to the box tiers above now lives in Tailwind
   v4 `@theme` (see app/globals.css) and is applied via `text-<role>` utilities
   (text-title / text-heading / text-lead / text-body / text-small / text-label /
   text-badge / text-micro / text-nano, plus the responsive `text-display*`
   headline steps). Use those utility classes for font sizes; the button/badge
   tiers above keep their own `font` values for tier-driven labels. */

export { ACID, INK, MONO, HEAD, BODY, GITHUB, CHROME, FIREFOX, INTUNED, INTUNED_PRICING, BLOG, SEL_ELEMENT, SEL_LIST, TIER_CTA, TIER_CONTROL, TIER_BADGE };
