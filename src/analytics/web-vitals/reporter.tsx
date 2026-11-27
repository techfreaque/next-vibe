"use client";

/**
 * Real-user Core Web Vitals reporter (loaded lazily via ./reporter-provider).
 * Collects LCP, INP, CLS, TTFB and FCP for the landing page view with the
 * web-vitals library and sends them in at most two small batches:
 * TTFB/FCP once both are known (this also warms the API client), the rest
 * when the page is hidden (web-vitals finalizes LCP/INP/CLS there).
 * Fire-and-forget: never blocks or changes the UI.
 */

import { platform } from "next-vibe/core/env-client";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { JWTPublicPayloadType } from "next-vibe/identity/auth/types";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { useLogger } from "next-vibe/ui/hooks/use-logger";
import {
  addDocumentListener,
  addWindowListener,
  getVisibilityState,
} from "next-vibe/ui/lib/dom";
import { getCurrentPathname } from "next-vibe/ui/lib/location";
import { getScreenWidth } from "next-vibe/ui/lib/screen";
import { apiClient } from "next-vibe/unified-ui/hooks/store";
import { useEffect } from "react";
import type { z } from "zod";

import definitions, { type webVitalMeasurementSchema } from "./definition";
import {
  WebVitalDevice,
  WebVitalMetric,
  type WebVitalMetricValue,
  WebVitalRating,
} from "./enum";

type Measurement = z.output<typeof webVitalMeasurementSchema>;

/** Share of page views that report. 1 = all (traffic is still small). */
const SAMPLE_RATE = 1;
/** Matches the Tailwind md breakpoint the mobile layouts switch on. */
const MOBILE_MAX_WIDTH = 767;

// Not used for auth: the server resolves the lead from cookies.
const PUBLIC_USER = {
  isPublic: true,
  leadId: "00000000-0000-0000-0000-000000000000",
  roles: [UserPermissionRole.PUBLIC],
} satisfies JWTPublicPayloadType;

const METRIC_BY_NAME: Record<string, typeof WebVitalMetricValue> = {
  LCP: WebVitalMetric.LCP,
  INP: WebVitalMetric.INP,
  CLS: WebVitalMetric.CLS,
  TTFB: WebVitalMetric.TTFB,
  FCP: WebVitalMetric.FCP,
};

const RATING_BY_NAME = {
  good: WebVitalRating.GOOD,
  "needs-improvement": WebVitalRating.NEEDS_IMPROVEMENT,
  poor: WebVitalRating.POOR,
} as const;

export function WebVitalsReporter({
  locale,
}: {
  locale: CountryLanguage;
}): null {
  const logger = useLogger();

  useEffect(() => {
    if (!platform.isBrowser || Math.random() >= SAMPLE_RATE) {
      return undefined;
    }

    // The landing path owns this view's vitals, also after client navigations.
    const path = getCurrentPathname().slice(0, 200);
    const device =
      getScreenWidth(logger) <= MOBILE_MAX_WIDTH
        ? WebVitalDevice.MOBILE
        : WebVitalDevice.DESKTOP;
    const pending = new Map<typeof WebVitalMetricValue, Measurement>();
    const sent = new Set<typeof WebVitalMetricValue>();

    const flush = (): void => {
      const metrics = [...pending.values()].filter((m) => !sent.has(m.metric));
      pending.clear();
      if (metrics.length === 0) {
        return;
      }
      for (const m of metrics) {
        sent.add(m.metric);
      }
      void (async (): Promise<void> => {
        const result = await apiClient.mutate(
          definitions.POST,
          logger,
          PUBLIC_USER,
          { path, device, metrics },
          undefined,
          locale,
        );
        if (!result.success) {
          logger.debug("Web vitals not recorded", {
            error: parseError(result).message,
          });
        }
      })();
    };

    const onMetric = (report: {
      name: string;
      value: number;
      rating: keyof typeof RATING_BY_NAME;
      navigationType: string;
    }): void => {
      const metric = METRIC_BY_NAME[report.name];
      if (!metric || sent.has(metric)) {
        return;
      }
      pending.set(metric, {
        metric,
        value: Math.max(0, Math.round(report.value * 1000) / 1000),
        rating: RATING_BY_NAME[report.rating],
        navigationType: report.navigationType,
      });
      // Early batch: TTFB + FCP are final right after first paint.
      if (
        pending.has(WebVitalMetric.TTFB) &&
        pending.has(WebVitalMetric.FCP) &&
        sent.size === 0
      ) {
        flush();
      }
    };

    const listeners: Array<() => void> = [];
    const lifetime = new AbortController();
    void import("web-vitals").then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
      if (lifetime.signal.aborted) {
        return undefined;
      }
      onTTFB(onMetric);
      onFCP(onMetric);
      onLCP(onMetric);
      onINP(onMetric);
      onCLS(onMetric);
      // Registered after web-vitals' own hidden handlers, so the final
      // LCP/INP/CLS values are already pending when this flushes.
      listeners.push(
        addDocumentListener("visibilitychange", () => {
          if (getVisibilityState() === "hidden") {
            flush();
          }
        }),
        addWindowListener("pagehide", flush),
      );
      return undefined;
    });

    return (): void => {
      lifetime.abort();
      for (const remove of listeners) {
        remove();
      }
    };
  }, [locale, logger]);

  return null;
}
