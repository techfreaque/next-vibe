"use client";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { JSX } from "react";
import { lazy, Suspense } from "react";

/**
 * The reporter renders nothing and starts in an effect after hydration, so
 * its code (endpoint definition + web-vitals) stays out of the initial JS.
 */
const WebVitalsReporter = lazy(() =>
  import("./reporter").then((m) => ({ default: m.WebVitalsReporter })),
);

/** Real-user Core Web Vitals reporting. Include once in the root layout. */
export function WebVitalsProvider({
  locale,
}: {
  locale: CountryLanguage;
}): JSX.Element {
  return (
    <Suspense fallback={null}>
      <WebVitalsReporter locale={locale} />
    </Suspense>
  );
}
