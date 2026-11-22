/**
 * Ops overview for the admin business overview.
 * Exact counts (never a page): unresolved error classes, error occurrences in
 * the period (vs previous period), failing cron tasks, unhealthy remote
 * connections. Reads stored state only; never contacts a remote.
 */

import "server-only";

import { count, eq, sql } from "drizzle-orm";

import type { CountryLanguage } from "../../core/i18n/core/config";
import { defaultLocale } from "../../core/i18n/core/config";
import type { ResponseType } from "../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../core/route/response.schema";
import { parseError } from "../../core/utils/parse-error";
import { db } from "../../database";
import { getUnhealthyConnectionCount } from "../../remote-connection/health-summary";
import { getFailingTaskCount } from "../../tasks/cron/health-summary";
import type { Kpi } from "../../unified-ui/analytics/schema";
import type { AnalyticsWindow } from "../../unified-ui/analytics/window";
import {
  inPreviousWindowSql,
  inWindowSql,
} from "../../unified-ui/analytics/window-sql";
import type { EndpointLogger } from "../types";
import { dailyHistoryWindow } from "./daily";
import { errorLogDaily, errorLogs } from "./db";
import { scopedTranslation } from "./logs/i18n";

export interface OpsOverview {
  /** Unresolved error classes (fingerprints), all time. */
  unresolvedErrors: number;
  /** Error occurrences in the period, previous = same-length period before. */
  errorOccurrences: Kpi;
  /**
   * First day the occurrences cover (YYYY-MM-DD) when live daily history
   * starts inside the period, else null (the whole period is covered).
   */
  errorOccurrencesSince: string | null;
  /** Enabled cron tasks whose last run failed, errored or timed out. */
  failingTasks: number;
  /** Remote connections disconnected or never synced. */
  unhealthyConnections: number;
}

/**
 * Occurrences of UNRESOLVED error classes in [period) and in the previous
 * period, from live daily history only (the alert pairs this with the
 * unresolved count; the error-logs report shows the same number by default).
 */
export async function getErrorOccurrencesKpi(
  win: Pick<AnalyticsWindow, "from" | "to" | "previousFrom" | "previousTo">,
): Promise<Kpi> {
  const daily = dailyHistoryWindow(win);
  const [row] = await db
    .select({
      current: sql<string>`COALESCE(SUM(${errorLogDaily.occurrences}) FILTER (WHERE ${inWindowSql(errorLogDaily.day, daily)}), 0)`,
      previous: sql<string>`COALESCE(SUM(${errorLogDaily.occurrences}) FILTER (WHERE ${inPreviousWindowSql(errorLogDaily.day, daily)}), 0)`,
    })
    .from(errorLogDaily)
    .innerJoin(errorLogs, eq(errorLogs.fingerprint, errorLogDaily.fingerprint))
    .where(eq(errorLogs.resolved, false));
  return {
    value: Number(row?.current ?? 0),
    previous: daily.previousFrom ? Number(row?.previous ?? 0) : null,
  };
}

export async function getOpsOverview(
  win: AnalyticsWindow,
  logger: EndpointLogger,
  locale: CountryLanguage = defaultLocale,
): Promise<ResponseType<OpsOverview>> {
  try {
    const [unresolved, errorOccurrences, failingTasks, unhealthyConnections] =
      await Promise.all([
        db
          .select({ n: count() })
          .from(errorLogs)
          .where(eq(errorLogs.resolved, false))
          .then((rows) => rows[0]?.n ?? 0),
        getErrorOccurrencesKpi(win),
        getFailingTaskCount(),
        getUnhealthyConnectionCount(),
      ]);
    const daily = dailyHistoryWindow(win);
    return success({
      unresolvedErrors: unresolved,
      errorOccurrences,
      errorOccurrencesSince:
        daily.from.getTime() > win.from.getTime()
          ? daily.from.toISOString().slice(0, 10)
          : null,
      failingTasks,
      unhealthyConnections,
    });
  } catch (error) {
    const parsed = parseError(error);
    logger.error("Failed to build ops overview", { error: parsed.message });
    const { t } = scopedTranslation.scopedT(locale);
    return fail({
      message: t("errors.fetchErrorLogs", { error: parsed.message }),
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
    });
  }
}
