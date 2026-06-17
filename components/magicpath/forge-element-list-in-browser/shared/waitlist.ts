import posthog from 'posthog-js';

/**
 * Records a "GET NOTIFIED" CLI-waitlist signup in PostHog: identifies the person
 * by email (so the profile carries their first-touch UTM properties) and fires a
 * `cli_waitlist_signup` event. PostHog auto-attaches the current `utm_*` params,
 * so signups can be broken down by campaign.
 *
 * Guarded on `posthog.__loaded`, so it's a silent no-op when PostHog isn't
 * configured (no `NEXT_PUBLIC_POSTHOG_KEY` — local dev / previews).
 */
export function captureWaitlistSignup(email: string): void {
  if (!posthog.__loaded) return;
  posthog.identify(email, { email });
  posthog.capture('cli_waitlist_signup', { email });
}
