/* ---------- phase windows ---------- */
const EL_B = 0.46; // element highlight + JUDGED hold ends
const LIST_A = 0.52,
  LIST_B = 0.82;
const SHIP_A = 0.87;
const CHROME_H = 44;

/* intro choreography (element pick): click icon → click "Pick element" → click value */
const W_ICON = 0.092; // moment the extension icon is clicked
const W_PICK = 0.205; // moment "Pick element" is clicked
const W_TARGET = 0.285; // moment the value on the page is clicked

export { EL_B, LIST_A, LIST_B, SHIP_A, CHROME_H, W_ICON, W_PICK, W_TARGET };
