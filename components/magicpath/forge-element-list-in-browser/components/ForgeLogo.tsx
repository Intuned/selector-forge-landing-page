import React from 'react';
import { ACID, INK } from '../shared/tokens';

/* ============================================================================
   FORGE LOGO — the Selector Forge brand mark: an ANVIL (forge → anvil →
   "Forged, not copied."). Reconstructed from the 4-layer export the user
   supplied (Group 1.svg, a single combined path set at viewBox 0 0 72 41).

   The source art was a single solid orange. The landing page is a strict
   single-accent palette — acid only, never a second accent — so the mark is
   recolorable and defaults to ink/acid rather than the original orange.

     <ForgeMark/>  — the anvil glyph alone (transparent ground). `fill` defaults
                     to currentColor so a parent can drive the color; pass an
                     explicit color to override. Aspect ratio is 72:41.
     <ForgeIcon/>  — the SQUARED app/favicon tile: the anvil centered on a solid
                     ground with sharp brutalist corners. Defaults to an acid
                     anvil on ink. `size` is the square edge in px.
   ============================================================================ */

// The anvil, as four filled sub-paths in a 72×41 box.
const ANVIL_PATHS = [
  'M1.4788e-06 3.31909H18.8934L18.8913 15.1392L13.6938 15.1442C12.6571 15.1447 11.304 15.1821 10.2979 15.0935C7.68967 14.8622 5.24424 13.7268 3.38445 11.8835C0.950513 9.48717 0.0160763 6.66674 1.4788e-06 3.31909Z',
  'M65.7514 0.0140934C67.577 0.0231792 69.4024 0.0185198 71.2279 -1.19442e-06C71.2262 1.03916 71.2167 2.09043 71.2284 3.12842C64.0971 3.86367 59.8285 8.2592 58.4106 15.1414C55.9854 15.1342 53.3695 15.1855 50.9627 15.1303C47.5129 15.1971 43.8809 15.1414 40.4106 15.1409L20.5312 15.1381C20.5774 13.3623 20.5473 11.4737 20.5473 9.69067L20.5458 0.00197904C25.8852 0.0629003 31.3093 0.0153747 36.6537 0.0153747L65.7514 0.0140934Z',
  'M23.9733 16.8621C24.4506 16.7846 26.3549 16.8231 26.9644 16.8236L33.2499 16.8264L46.1653 16.8248C48.4668 16.8248 51.0709 16.7679 53.3468 16.856C50.9009 18.973 49.2917 21.2583 48.9923 24.5782C48.6619 28.2369 50.7209 32.1197 53.5965 34.3098C51.1311 34.3152 48.465 34.366 46.0148 34.3114C45.8224 34.3264 45.8113 34.3281 45.6213 34.3008C45.5025 34.1776 45.2377 33.4352 45.1056 33.1843C44.157 31.3823 42.5829 30.0796 40.6152 29.515C38.7489 28.986 36.7488 29.2202 35.0552 30.1661C33.4638 31.0551 32.1751 32.5556 31.671 34.3192C29.004 34.2958 26.332 34.337 23.6616 34.3036C29.5647 29.4564 29.9295 21.8731 23.9581 16.9268L23.9733 16.8621Z',
  'M15.3425 40.5805V35.991H33.0482C33.0482 32.9674 35.4993 30.5162 38.5229 30.5162C41.5466 30.5162 43.9977 32.9674 43.9977 35.991H61.9363V40.5805H15.3425Z'
];

const ForgeMark: React.FC<
  { fill?: string; title?: string } & React.SVGProps<SVGSVGElement>
> = ({ fill = 'currentColor', title = 'Selector Forge', ...rest }) => (
  <svg
    width="72"
    height="41"
    viewBox="0 0 72 41"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    {...rest}
  >
    <title>{title}</title>
    {ANVIL_PATHS.map((d, i) => (
      <path key={i} d={d} fill={fill} />
    ))}
  </svg>
);

/* Squared tile. The anvil keeps its 72:41 aspect and is centered on the ground;
   `inset` is the share of the edge kept clear around the mark (0..0.5). */
const ForgeIcon: React.FC<{
  size?: number;
  bg?: string;
  fg?: string;
  inset?: number;
  title?: string;
}> = ({ size = 64, bg = INK, fg = ACID, inset = 0.18, title = 'Selector Forge' }) => {
  const markW = size * (1 - inset * 2);
  const markH = (markW * 41) / 72;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <title>{title}</title>
      <rect width={size} height={size} fill={bg} />
      <g
        fill={fg}
        transform={`translate(${(size - markW) / 2} ${(size - markH) / 2}) scale(${markW / 72})`}
      >
        {ANVIL_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
};

export { ForgeMark, ForgeIcon, ANVIL_PATHS };
