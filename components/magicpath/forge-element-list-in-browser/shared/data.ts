import { EL_B, LIST_A, LIST_B, SHIP_A, W_TARGET } from './constants';
import type { Row } from './types';

const PAGE = {
  id: 'RFP-2026-0142',
  title: 'RFP-2026-0142 — Roadway Maintenance Services',
  agency: 'Dept. of General Services',
  url: 'bidportal.example/opp/RFP-2026-0142/view',
  filesUrl: 'bidportal.example/opp/RFP-2026-0142/view#files',
  rows: [{
    label: 'Agency',
    value: 'Dept. of General Services'
  }, {
    label: 'Solicitation Type',
    value: 'Request for Proposal',
    target: true
  }, {
    label: 'Status',
    value: 'Open — accepting bids'
  }, {
    label: 'Due Date',
    value: 'July 3, 2026'
  }] as Row[]
};
const FILES = ['RFP-2026-0142-full-packet.pdf', 'attachment-A-scope-of-work.pdf', 'attachment-B-pricing-sheet.xlsx', 'addendum-01-qa-responses.pdf', 'vendor-conference-slides.pdf'];
const BEATS = [{
  a: 0.04,
  b: W_TARGET + 0.02,
  eyebrow: 'PICK ANY ELEMENT',
  line: 'Click the selector-forge icon, then click the value you want.'
}, {
  a: W_TARGET + 0.03,
  b: EL_B,
  eyebrow: 'ANCHORED TO THE LABEL',
  line: 'The selector ties to its label — not its position.'
}, {
  a: LIST_A,
  b: LIST_B,
  eyebrow: 'OR THE WHOLE LIST',
  line: 'Scroll to the files, pick one — get every file, any count.'
}];
const TICKS = [{
  p: 0.0,
  label: 'INTRO'
}, {
  p: 0.12,
  label: 'ELEMENT'
}, {
  p: LIST_A,
  label: 'LIST'
}, {
  p: SHIP_A,
  label: 'SHIP'
}];

export { PAGE, FILES, BEATS, TICKS };
