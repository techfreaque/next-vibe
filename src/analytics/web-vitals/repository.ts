/**
 * Web Vitals repository: ingest real-user measurements, report p75 per page type.
 */

import "server-only";

import { and, eq, gte, sql } from "drizzle-orm";
import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import {
  ErrorResponseTypes,
  fail,
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { db } from "next-vibe/database";
import type { EndpointLogger } from "next-vibe/logger/types";

import { isLikelyBot } from "@/leads/growth/attribution";

import { webVitals } from "./db";
import type {
  WebVitalsGetRequest,
  WebVitalsGetResponse,
  WebVitalsPostRequest,
  WebVitalsPostResponse,
} from "./definition";
import { WebVitalMetricDB, WebVitalPageTypeDB, WebVitalRating } from "./enum";
import { scopedTranslation } from "./i18n";
import { classifyPageType } from "./page-type";
import { rateWebVital, SYNTHETIC_AGENT_PATTERN } from "./thresholds";

const DAY_MS = 24 * 60 * 60 * 1000;

function isMetric(value: string): value is (typeof WebVitalMetricDB)[number] {
  return WebVitalMetricDB.some((m) => m === value);
}

function isPageType(
  value: string,
): value is (typeof WebVitalPageTypeDB)[number] {
  return WebVitalPageTypeDB.some((p) => p === value);
}

export class WebVitalsRepository {
  static async record(
    data: WebVitalsPostRequest,
    userAgent: string | null,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<WebVitalsPostResponse>> {
    // Crawlers and lab tools would skew field percentiles: accept, store nothing.
    if (
      isLikelyBot(userAgent) ||
      SYNTHETIC_AGENT_PATTERN.test(userAgent ?? "")
    ) {
      return success({ recorded: 0 });
    }
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const pageType = classifyPageType(data.path);
      // One value per metric per view: last one wins if a client repeats it.
      const byMetric = new Map(data.metrics.map((m) => [m.metric, m]));
      const rows = [...byMetric.values()].map((m) => ({
        metric: m.metric,
        value: m.value,
        // Re-rate server side; the client value is not trusted for reports.
        rating: rateWebVital(m.metric, m.value),
        pageType,
        path: data.path,
        locale,
        device: data.device,
        navigationType: m.navigationType ?? null,
      }));
      await db.insert(webVitals).values(rows);
      return success({ recorded: rows.length });
    } catch (error) {
      logger.error("Failed to store web vitals", parseError(error), {
        path: data.path,
      });
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async report(
    data: WebVitalsGetRequest,
    locale: CountryLanguage,
    logger: EndpointLogger,
  ): Promise<ResponseType<WebVitalsGetResponse>> {
    const { t } = scopedTranslation.scopedT(locale);
    try {
      const since = new Date(Date.now() - data.days * DAY_MS);
      const result = await db
        .select({
          pageType: webVitals.pageType,
          metric: webVitals.metric,
          samples: sql<number>`count(*)::int`,
          p75: sql<number>`percentile_cont(0.75) within group (order by ${webVitals.value})`,
          good: sql<number>`count(*) filter (where ${webVitals.rating} = ${WebVitalRating.GOOD})::int`,
          poor: sql<number>`count(*) filter (where ${webVitals.rating} = ${WebVitalRating.POOR})::int`,
        })
        .from(webVitals)
        .where(
          and(
            gte(webVitals.recordedAt, since),
            eq(webVitals.device, data.device),
          ),
        )
        .groupBy(webVitals.pageType, webVitals.metric);

      const rows = result
        .filter((r) => isPageType(r.pageType) && isMetric(r.metric))
        .map((r) => {
          const p75 = Number(r.p75);
          return {
            pageType: r.pageType,
            metric: r.metric,
            samples: r.samples,
            p75,
            goodShare: r.samples > 0 ? r.good / r.samples : 0,
            poorShare: r.samples > 0 ? r.poor / r.samples : 0,
            rating: rateWebVital(r.metric, p75),
          };
        })
        .toSorted(
          (a, b) =>
            WebVitalPageTypeDB.indexOf(a.pageType) -
              WebVitalPageTypeDB.indexOf(b.pageType) ||
            WebVitalMetricDB.indexOf(a.metric) -
              WebVitalMetricDB.indexOf(b.metric),
        );

      return success({
        since: since.toISOString(),
        total: rows.reduce((sum, r) => sum + r.samples, 0),
        rows,
      });
    } catch (error) {
      logger.error("Failed to load web vitals report", parseError(error));
      return fail({
        message: t("errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
