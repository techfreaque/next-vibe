"use client";

import type { JSX } from "react";
import { lazy, Suspense } from "react";

/**
 * The tracker renders nothing and only acts in an effect after hydration, so
 * its code (tracking definition + lead enum + all lead i18n, ~75 KB gzipped)
 * is split out of the root layout's initial JS and fetched after first paint.
 */
const LeadTracking = lazy(() =>
  import("./lead-tracking").then((m) => ({ default: m.LeadTracking })),
);

/**
 * Global Lead Tracking Provider - include once in the root layout.
 * See ./lead-tracking for the visit-recording logic.
 */
export function LeadTrackingProvider(): JSX.Element {
  return (
    <Suspense fallback={null}>
      <LeadTracking />
    </Suspense>
  );
}
