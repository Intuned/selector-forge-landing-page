/* ---------- math helpers ---------- */
const clamp = (v: number, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPt = (a: {
  x: number;
  y: number;
}, b: {
  x: number;
  y: number;
}, t: number) => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t)
});
const easeInOut = (t: number) => {
  const c = clamp(t);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
};
const seg = (p: number, a: number, b: number) => easeInOut(clamp((p - a) / (b - a)));
const segLin = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
const band = (p: number, a: number, b: number, fade = 0.04) => {
  const inA = clamp((p - a) / fade);
  const outA = 1 - clamp((p - (b - fade)) / fade);
  return clamp(Math.min(inA, outA));
};

export { clamp, lerp, lerpPt, easeInOut, seg, segLin, band };
