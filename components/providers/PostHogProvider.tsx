'use client';

import { Suspense, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import posthog from 'posthog-js';

/**
 * Captures a `$pageview` on every client-side route change. The App Router does
 * SPA navigation, which PostHog's history-based auto-capture doesn't see, so we
 * disable `capture_pageview` and track route changes here instead. Reading
 * `useSearchParams` is why this lives inside a `<Suspense>` boundary (see the
 * provider below) — that boundary is also required under `output: export`.
 */
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!posthog.__loaded) return;
    let url = window.origin + pathname;
    const query = searchParams.toString();
    if (query) url += `?${query}`;
    posthog.capture('$pageview', { $current_url: url });
  }, [pathname, searchParams]);

  return null;
}

/**
 * Initializes PostHog (browser SDK, client-only) and mounts pageview tracking.
 * Initialization is guarded on `NEXT_PUBLIC_POSTHOG_KEY`: with no key, analytics
 * is a silent no-op, so local dev and previews work without configuration.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
      capture_pageview: false,
      capture_pageleave: true,
    });
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageView />
      </Suspense>
      {children}
    </>
  );
}
