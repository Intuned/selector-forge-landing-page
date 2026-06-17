'use client';

import { useSyncExternalStore } from 'react';
import { CHROME, FIREFOX } from './tokens';

export interface InstallTarget {
  /** CTA label, e.g. "Add to Chrome" or "Add on Firefox". */
  label: string;
  /** Web-store URL the CTA links to. */
  href: string;
}

const CHROME_TARGET: InstallTarget = { label: 'Add to Chrome', href: CHROME };
const FIREFOX_TARGET: InstallTarget = { label: 'Add on Firefox', href: FIREFOX };

// The UA never changes after load, so there's nothing to subscribe to.
const noopSubscribe = () => () => {};
const getIsFirefox = () =>
  typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
// SSR (and the matching first client render during hydration) always assume a
// non-Firefox browser; React then re-renders on the client with the real UA.
const getServerSnapshot = () => false;

/**
 * Picks the install CTA for the visitor's browser: Firefox gets the AMO
 * listing, every other browser gets the Chrome Web Store. Uses
 * useSyncExternalStore so the server-rendered markup (Chrome) matches the first
 * client render — no hydration mismatch — before flipping to the real UA.
 */
export function useInstallTarget(): InstallTarget {
  const isFirefox = useSyncExternalStore(noopSubscribe, getIsFirefox, getServerSnapshot);
  return isFirefox ? FIREFOX_TARGET : CHROME_TARGET;
}
