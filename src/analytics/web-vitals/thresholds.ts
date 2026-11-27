/**
 * Core Web Vitals thresholds (web.dev): [good upper bound, poor lower bound].
 * Values in ms except CLS (unitless).
 */

import {
  WebVitalMetric,
  type WebVitalMetricValue,
  WebVitalRating,
  type WebVitalRatingValue,
} from "./enum";

export const WEB_VITAL_THRESHOLDS: Record<
  typeof WebVitalMetricValue,
  readonly [number, number]
> = {
  [WebVitalMetric.LCP]: [2500, 4000],
  [WebVitalMetric.INP]: [200, 500],
  [WebVitalMetric.CLS]: [0.1, 0.25],
  [WebVitalMetric.TTFB]: [800, 1800],
  [WebVitalMetric.FCP]: [1800, 3000],
};

export function rateWebVital(
  metric: typeof WebVitalMetricValue,
  value: number,
): typeof WebVitalRatingValue {
  const [good, poor] = WEB_VITAL_THRESHOLDS[metric];
  if (value <= good) {
    return WebVitalRating.GOOD;
  }
  return value > poor ? WebVitalRating.POOR : WebVitalRating.NEEDS_IMPROVEMENT;
}

/** Synthetic agents (Lighthouse, headless browsers, monitors) are not field data. */
export const SYNTHETIC_AGENT_PATTERN =
  /HeadlessChrome|Lighthouse|PTST|GTmetrix|PageSpeed|Speed Insights|pingdom|Prerender/i;
