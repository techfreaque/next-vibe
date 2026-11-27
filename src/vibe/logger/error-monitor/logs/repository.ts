/**
 * Error Logs Repository
 * Data access layer for browsing error logs and toggling resolved status.
 * Each fingerprint = one row (dedup on write), so no GROUP BY needed.
 */

import "server-only";

import type { SQL } from "drizzle-orm";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  min,
  or,
  sql,
} from "drizzle-orm";
import type { QueryResultRow } from "pg";

import type { ResponseType } from "../../../core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "../../../core/route/response.schema";
import type { WidgetData } from "../../../core/utils/json";
import { WidgetDataSchema } from "../../../core/utils/json";
import { parseError } from "../../../core/utils/parse-error";
import { db } from "../../../database";
import type { Kpi } from "../../../unified-ui/analytics/schema";
import type { AnalyticsWindow } from "../../../unified-ui/analytics/window";
import {
  fillBuckets,
  resolveAnalyticsWindow,
  serializeWindow,
} from "../../../unified-ui/analytics/window";
import {
  bucketSql,
  inPreviousWindowSql,
  inWindowSql,
  utcSql,
} from "../../../unified-ui/analytics/window-sql";
import type { EndpointLogger } from "../../types";
import type { LoggerMetadata } from "../../types";
import { dailyHistoryWindow, ERROR_LOG_DAILY_SINCE } from "../daily";
import { errorLogDaily, errorLogs } from "../db";
import {
  ERROR_LOGS_ENDPOINT_LIMIT,
  ERROR_LOGS_PAGE_SIZE,
  ERROR_LOGS_SAMPLE_IDS,
} from "./constants";
import type {
  ErrorLogsPatchRequestOutput,
  ErrorLogsPatchResponseOutput,
  ErrorLogsRequestOutput,
  ErrorLogsResponseOutput,
} from "./definition";
import {
  ERROR_LOG_TREND_SERIES,
  ErrorLogLevelFilter,
  ErrorLogSort,
  ErrorLogSourceFilter,
  ErrorLogStatusFilter,
  ErrorLogTrendSplit,
} from "./enum";
import type { ErrorLogsT } from "./i18n";

/** Escape LIKE wildcards in user input. */
function escapeLike(v: string): string {
  return v.replace(/[\\%_]/g, "\\$&");
}

/** Distinct ids across the given member fingerprints. */
function idsForAll(
  list: ReadonlyArray<{ fingerprint: string; ids: string[] | null }>,
  fingerprints: readonly string[],
): string[] {
  const out = new Set<string>();
  for (const row of list) {
    if (fingerprints.includes(row.fingerprint)) {
      for (const id of row.ids ?? []) {
        out.add(id);
      }
    }
  }
  return [...out].toSorted();
}

export class ErrorLogsRepository {
  /**
   * Metadata is JSONB — at rest it is plain JSON (Errors/Dates already
   * serialized). A malformed legacy entry should never hide its error group.
   */
  private static normalizeMetadata(
    raw: LoggerMetadata[] | null | undefined,
  ): WidgetData[] | null {
    const arr = Array.isArray(raw)
      ? raw
      : raw !== null && raw !== undefined
        ? [raw]
        : null;
    const valid = arr?.flatMap((entry) => {
      const result = WidgetDataSchema.safeParse(entry);
      return result.success ? [result.data] : [];
    });
    return valid?.length ? valid : null;
  }

  /** First endpoint-like value in the row's metadata (endpoint > path > alias > route). */
  private static endpointKeySql(): SQL<string | null> {
    return sql<
      string | null
    >`(SELECT regexp_replace(COALESCE(e->>'endpoint', e->>'endpointPath', e->>'alias', regexp_replace(e->>'route', '^/[a-z]{2}-[A-Za-z]+', '')), '/(GET|POST|PUT|PATCH|DELETE)$', '') FROM jsonb_array_elements(CASE WHEN jsonb_typeof(${errorLogs.metadata}) = 'array' THEN ${errorLogs.metadata} ELSE '[]'::jsonb END) e WHERE jsonb_typeof(e) = 'object' AND COALESCE(e->>'endpoint', e->>'endpointPath', e->>'alias', e->>'route') IS NOT NULL LIMIT 1)`;
  }

  private static isClientSql(): SQL<boolean> {
    return sql<boolean>`(${errorLogs.message} LIKE '[client]%')`;
  }

  /** Every filter except the period, applied to error_logs columns. */
  private static buildFilters(data: ErrorLogsRequestOutput): SQL[] {
    const conditions: SQL[] = [];
    if (data.status === ErrorLogStatusFilter.ACTIVE) {
      conditions.push(eq(errorLogs.resolved, false));
    } else if (data.status === ErrorLogStatusFilter.RESOLVED) {
      conditions.push(eq(errorLogs.resolved, true));
    }
    if (data.level === ErrorLogLevelFilter.ERROR) {
      conditions.push(eq(errorLogs.level, "error"));
    } else if (data.level === ErrorLogLevelFilter.WARN) {
      conditions.push(eq(errorLogs.level, "warn"));
    }
    if (data.source === ErrorLogSourceFilter.CLIENT) {
      conditions.push(ErrorLogsRepository.isClientSql());
    } else if (data.source === ErrorLogSourceFilter.SERVER) {
      conditions.push(sql`NOT ${ErrorLogsRepository.isClientSql()}`);
    }
    const search = data.search?.trim();
    if (search) {
      const term = escapeLike(search);
      const match = or(
        ilike(errorLogs.message, `%${term}%`),
        ilike(errorLogs.fingerprint, `${term}%`),
        ilike(sql`${errorLogs.id}::text`, `${term}%`),
      );
      if (match) {
        conditions.push(match);
      }
    }
    const errorType = data.errorType?.trim();
    if (errorType) {
      conditions.push(ilike(errorLogs.errorType, `%${escapeLike(errorType)}%`));
    }
    const endpoint = data.endpoint?.trim();
    if (endpoint) {
      conditions.push(
        sql`${ErrorLogsRepository.endpointKeySql()} ILIKE ${`%${escapeLike(endpoint)}%`}`,
      );
    }
    const fingerprint = data.fingerprint?.trim();
    if (fingerprint) {
      conditions.push(eq(errorLogs.fingerprint, fingerprint));
    }
    return conditions;
  }

  /** The class had an occurrence that can fall inside [from, to). */
  private static seenInWindowSql(win: AnalyticsWindow): SQL {
    return sql`(${errorLogs.createdAt} >= ${utcSql(win.from)} AND ${errorLogs.firstSeen} < ${utcSql(win.to)})`;
  }

  private static orderBy(
    sort: ErrorLogsRequestOutput["sort"],
    windowOccurrences: SQL<number>,
  ): SQL[] {
    switch (sort) {
      case ErrorLogSort.LAST_SEEN:
        return [desc(errorLogs.createdAt), desc(errorLogs.id)];
      case ErrorLogSort.FIRST_SEEN:
        return [desc(errorLogs.firstSeen), desc(errorLogs.id)];
      case ErrorLogSort.TOTAL_OCCURRENCES:
        return [desc(errorLogs.occurrences), desc(errorLogs.createdAt)];
      default:
        return [
          desc(windowOccurrences),
          desc(errorLogs.occurrences),
          desc(errorLogs.createdAt),
        ];
    }
  }

  static async getLogs(
    data: ErrorLogsRequestOutput,
    t: ErrorLogsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorLogsResponseOutput>> {
    try {
      const limit = data.limit || ERROR_LOGS_PAGE_SIZE;
      const offset = data.offset ?? 0;

      const [floorRow] = await db
        .select({ floor: min(errorLogs.firstSeen) })
        .from(errorLogs);
      const win = resolveAnalyticsWindow(
        data,
        new Date(),
        floorRow?.floor ?? null,
      );

      const filters = ErrorLogsRepository.buildFilters(data);
      const filterSql = filters.length > 0 ? and(...filters) : sql`TRUE`;
      const listWhere = and(
        filterSql,
        ErrorLogsRepository.seenInWindowSql(win),
      );
      const dailyJoin = eq(errorLogDaily.fingerprint, errorLogs.fingerprint);
      // Per-day numbers only from live daily history (see ERROR_LOG_DAILY_SINCE).
      const dailyWin = dailyHistoryWindow(win);
      const dailyInWindow = sql`${inWindowSql(errorLogDaily.day, dailyWin)}`;
      const dailyInPrevious = sql`${inPreviousWindowSql(errorLogDaily.day, dailyWin)}`;
      const hasPrevious = win.previousFrom !== null;
      const kpi = (current: number, previous: number): Kpi => ({
        value: current,
        previous: hasPrevious ? previous : null,
      });
      const dailyKpi = (current: number, previous: number): Kpi => ({
        value: current,
        previous: dailyWin.previousFrom !== null ? previous : null,
      });

      const grouped = data.group;
      const windowOccurrences = sql<number>`COALESCE((SELECT SUM(d.occurrences) FROM ${errorLogDaily} d WHERE d.fingerprint = "error_logs"."fingerprint" AND ${inWindowSql(sql`d.day`, dailyWin)}), 0)::int`;
      // Grouped: one row per message + resolved state, represented by its
      // biggest class; ranking and numbers cover the whole group. One pass
      // with GROUP BY (no per-row subqueries).
      const groupPage = grouped
        ? await ErrorLogsRepository.groupPage(
            listWhere ?? sql`TRUE`,
            dailyWin,
            data.sort,
            limit,
            offset,
          )
        : null;
      const listWhereFinal = groupPage
        ? inArray(
            errorLogs.fingerprint,
            groupPage.reps.length > 0 ? groupPage.reps : [""],
          )
        : listWhere;
      const endpointKey = ErrorLogsRepository.endpointKeySql();

      const [
        unorderedRows,
        [countResult],
        [unresolvedRow],
        [occurrenceRow],
        [newClassesRow],
        [affectedUsersRow],
        [affectedLeadsRow],
        trendRows,
        endpointRows,
        [historyRow],
      ] = await Promise.all([
        db
          .select({
            id: errorLogs.id,
            message: errorLogs.message,
            errorType: errorLogs.errorType,
            stackTrace: errorLogs.stackTrace,
            metadata: errorLogs.metadata,
            fingerprint: errorLogs.fingerprint,
            occurrences: errorLogs.occurrences,
            resolved: errorLogs.resolved,
            level: errorLogs.level,
            firstSeen: errorLogs.firstSeen,
            createdAt: errorLogs.createdAt,
            isClient: ErrorLogsRepository.isClientSql(),
            endpoint: endpointKey,
            windowOccurrences,
            similar: sql<number>`(SELECT COUNT(*) FROM ${errorLogs} e2 WHERE e2.message = "error_logs"."message" AND e2.fingerprint <> "error_logs"."fingerprint" AND e2.resolved = "error_logs"."resolved")::int`,
          })
          .from(errorLogs)
          .where(listWhereFinal)
          .orderBy(...ErrorLogsRepository.orderBy(data.sort, windowOccurrences))
          .limit(limit)
          .offset(groupPage ? 0 : offset),
        db.select({ count: count() }).from(errorLogs).where(listWhereFinal),
        db
          .select({
            unresolved: count(),
            occurrences: sql<string>`COALESCE(SUM(${errorLogs.occurrences}), 0)`,
            outside: sql<string>`COUNT(*) FILTER (WHERE NOT ${ErrorLogsRepository.seenInWindowSql(win)})`,
            messages: sql<string>`COUNT(DISTINCT ${errorLogs.message})`,
            matching: sql<string>`COUNT(*) FILTER (WHERE ${filterSql})`,
            inView: sql<string>`COUNT(*) FILTER (WHERE ${listWhere})`,
          })
          .from(errorLogs)
          .where(eq(errorLogs.resolved, false)),
        db
          .select({
            current: sql<string>`COALESCE(SUM(${errorLogDaily.occurrences}) FILTER (WHERE ${dailyInWindow}), 0)`,
            previous: sql<string>`COALESCE(SUM(${errorLogDaily.occurrences}) FILTER (WHERE ${dailyInPrevious}), 0)`,
            activeCurrent: sql<string>`COUNT(DISTINCT ${errorLogDaily.fingerprint}) FILTER (WHERE ${dailyInWindow})`,
            activePrevious: sql<string>`COUNT(DISTINCT ${errorLogDaily.fingerprint}) FILTER (WHERE ${dailyInPrevious})`,
          })
          .from(errorLogDaily)
          .innerJoin(errorLogs, dailyJoin)
          .where(filterSql),
        db
          .select({
            current: sql<string>`COUNT(*) FILTER (WHERE ${inWindowSql(errorLogs.firstSeen, win)})`,
            previous: sql<string>`COUNT(*) FILTER (WHERE ${inPreviousWindowSql(errorLogs.firstSeen, win)})`,
          })
          .from(errorLogs)
          .where(filterSql),
        ErrorLogsRepository.affectedKpi("user_ids", filterSql, dailyWin),
        ErrorLogsRepository.affectedKpi("lead_ids", filterSql, dailyWin),
        db
          .select({
            bucket: bucketSql(errorLogDaily.day, win.bucket),
            series: ErrorLogsRepository.seriesKeySql(data.split),
            value: sql<string>`SUM(${errorLogDaily.occurrences})`,
          })
          .from(errorLogDaily)
          .innerJoin(errorLogs, dailyJoin)
          .where(and(filterSql, dailyInWindow))
          .groupBy(sql`1`, sql`2`),
        db
          .select({
            key: endpointKey,
            occurrences: sql<string>`SUM(${errorLogDaily.occurrences})`,
            classes: sql<string>`COUNT(DISTINCT ${errorLogs.fingerprint})`,
            unresolved: sql<string>`COUNT(DISTINCT ${errorLogs.fingerprint}) FILTER (WHERE NOT ${errorLogs.resolved})`,
          })
          .from(errorLogDaily)
          .innerJoin(errorLogs, dailyJoin)
          .where(and(filterSql, dailyInWindow))
          .groupBy(sql`1`)
          .orderBy(sql`2 DESC`)
          .limit(ERROR_LOGS_ENDPOINT_LIMIT),
        db.select({ since: min(errorLogDaily.day) }).from(errorLogDaily),
      ]);

      const rows = groupPage
        ? groupPage.reps.flatMap((fp) =>
            unorderedRows.filter((r) => r.fingerprint === fp),
          )
        : unorderedRows;
      const totalCount = groupPage
        ? groupPage.total
        : (countResult?.count ?? 0);
      // Member classes per row (grouped: every class with the same message
      // and resolved state; else the row itself).
      const memberRows = grouped
        ? rows.length === 0
          ? []
          : await db
              .select({
                fingerprint: errorLogs.fingerprint,
                message: errorLogs.message,
                resolved: errorLogs.resolved,
                occurrences: errorLogs.occurrences,
                firstSeen: errorLogs.firstSeen,
                lastSeen: errorLogs.createdAt,
              })
              .from(errorLogs)
              .where(
                inArray(
                  errorLogs.message,
                  rows.map((r) => r.message),
                ),
              )
        : [];
      const membersOf = (row: {
        fingerprint: string;
        message: string;
        resolved: boolean;
      }): string[] =>
        grouped
          ? memberRows
              .filter(
                (m) => m.message === row.message && m.resolved === row.resolved,
              )
              .map((m) => m.fingerprint)
          : [row.fingerprint];
      const fingerprints = [...new Set(rows.flatMap((r) => membersOf(r)))];
      const [sparkRows, userRows, leadRows] =
        fingerprints.length === 0
          ? [[], [], []]
          : await Promise.all([
              db
                .select({
                  fingerprint: errorLogDaily.fingerprint,
                  bucket: bucketSql(errorLogDaily.day, win.bucket),
                  value: sql<string>`SUM(${errorLogDaily.occurrences})`,
                })
                .from(errorLogDaily)
                .where(
                  and(
                    inArray(errorLogDaily.fingerprint, fingerprints),
                    dailyInWindow,
                  ),
                )
                .groupBy(sql`1`, sql`2`),
              ErrorLogsRepository.affectedIds(
                "user_ids",
                fingerprints,
                dailyWin,
              ),
              ErrorLogsRepository.affectedIds(
                "lead_ids",
                fingerprints,
                dailyWin,
              ),
            ]);

      const series = ErrorLogsRepository.seriesKeys(data.split).map((key) => ({
        key,
        values: fillBuckets(
          win.buckets,
          trendRows
            .filter((r) => r.series === key)
            .map((r) => ({ bucket: r.bucket, value: Number(r.value) })),
        ),
      }));

      logger.debug(`Fetched ${rows.length.toString()} error log entries`);

      const response: ErrorLogsResponseOutput = {
        window: serializeWindow(win),
        kpis: {
          unresolved: unresolvedRow?.unresolved ?? 0,
          unresolvedOccurrences: Number(unresolvedRow?.occurrences ?? 0),
          unresolvedOutsideWindow: Number(unresolvedRow?.outside ?? 0),
          unresolvedMessages: Number(unresolvedRow?.messages ?? 0),
          unresolvedMatching: Number(unresolvedRow?.matching ?? 0),
          unresolvedInView: Number(unresolvedRow?.inView ?? 0),
          occurrences: dailyKpi(
            Number(occurrenceRow?.current ?? 0),
            Number(occurrenceRow?.previous ?? 0),
          ),
          newClasses: kpi(
            Number(newClassesRow?.current ?? 0),
            Number(newClassesRow?.previous ?? 0),
          ),
          activeClasses: dailyKpi(
            Number(occurrenceRow?.activeCurrent ?? 0),
            Number(occurrenceRow?.activePrevious ?? 0),
          ),
          affectedUsers: dailyKpi(
            Number(affectedUsersRow?.current ?? 0),
            Number(affectedUsersRow?.previous ?? 0),
          ),
          affectedLeads: dailyKpi(
            Number(affectedLeadsRow?.current ?? 0),
            Number(affectedLeadsRow?.previous ?? 0),
          ),
        },
        trend: { buckets: win.buckets, series },
        byEndpoint: endpointRows.map((r) => ({
          key: r.key,
          metrics: {
            occurrences: Number(r.occurrences),
            classes: Number(r.classes),
            unresolved: Number(r.unresolved),
          },
        })),
        historySince: historyRow?.since
          ? new Date(
              Math.max(
                historyRow.since.getTime(),
                ERROR_LOG_DAILY_SINCE.getTime(),
              ),
            )
              .toISOString()
              .slice(0, 10)
          : null,
        logs: rows.map((row) => {
          const members = membersOf(row);
          const userIds = idsForAll(userRows, members);
          const leadIds = idsForAll(leadRows, members);
          const memberStats = memberRows.filter((m) =>
            members.includes(m.fingerprint),
          );
          return {
            id: row.id,
            message: row.message,
            errorType: row.errorType,
            stackTrace: row.stackTrace,
            metadata: ErrorLogsRepository.normalizeMetadata(row.metadata),
            fingerprint: row.fingerprint,
            occurrences:
              memberStats.length > 0
                ? memberStats.reduce((sum, m) => sum + m.occurrences, 0)
                : row.occurrences,
            resolved: row.resolved,
            level: row.level,
            source: row.isClient ? "client" : "server",
            endpoint: row.endpoint,
            firstSeen: new Date(
              Math.min(
                row.firstSeen.getTime(),
                ...memberStats.map((m) => m.firstSeen.getTime()),
              ),
            ).toISOString(),
            createdAt: new Date(
              Math.max(
                row.createdAt.getTime(),
                ...memberStats.map((m) => m.lastSeen.getTime()),
              ),
            ).toISOString(),
            windowOccurrences:
              groupPage?.windowByRep.get(row.fingerprint) ??
              Number(row.windowOccurrences),
            spark: fillBuckets(
              win.buckets,
              sparkRows
                .filter((r) => members.includes(r.fingerprint))
                .map((r) => ({ bucket: r.bucket, value: Number(r.value) })),
            ),
            affectedUsers: userIds.length,
            affectedLeads: leadIds.length,
            similar: Number(row.similar),
            userIds: userIds.slice(0, ERROR_LOGS_SAMPLE_IDS),
            leadIds: leadIds.slice(0, ERROR_LOGS_SAMPLE_IDS),
          };
        }),
        totalCount,
        hasMore: totalCount > offset + limit,
        unresolvedCount: unresolvedRow?.unresolved ?? 0,
        pageSize: limit,
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch error logs", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.fetchErrorLogs", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /** One page of message groups: representative fingerprints in order. */
  private static async groupPage(
    where: SQL,
    win: AnalyticsWindow,
    sort: ErrorLogsRequestOutput["sort"],
    limit: number,
    offset: number,
  ): Promise<{
    reps: string[];
    windowByRep: Map<string, number>;
    total: number;
  }> {
    const orderBy =
      sort === ErrorLogSort.LAST_SEEN
        ? sql`last_seen DESC`
        : sort === ErrorLogSort.FIRST_SEEN
          ? sql`first_seen DESC`
          : sort === ErrorLogSort.TOTAL_OCCURRENCES
            ? sql`total DESC, last_seen DESC`
            : sql`hits DESC, total DESC, last_seen DESC`;
    const { rows } = await db.execute<
      QueryResultRow & { rep: string; hits: string; total_groups: string }
    >(sql`
      WITH base AS (
        SELECT "error_logs"."fingerprint" AS fingerprint, "error_logs"."message" AS message,
          "error_logs"."resolved" AS resolved, "error_logs"."occurrences" AS occurrences,
          "error_logs"."created_at" AS created_at, "error_logs"."first_seen" AS first_seen
        FROM ${errorLogs} WHERE ${where}
      ),
      hits AS (
        SELECT d.fingerprint, SUM(d.occurrences) AS w FROM ${errorLogDaily} d
        WHERE ${inWindowSql(sql`d.day`, win)} GROUP BY d.fingerprint
      ),
      g AS (
        SELECT (array_agg(b.fingerprint ORDER BY b.occurrences DESC, b.fingerprint))[1] AS rep,
          COALESCE(SUM(h.w), 0) AS hits, SUM(b.occurrences) AS total,
          MAX(b.created_at) AS last_seen, MAX(b.first_seen) AS first_seen
        FROM base b LEFT JOIN hits h ON h.fingerprint = b.fingerprint
        GROUP BY b.message, b.resolved
      )
      SELECT rep, hits, COUNT(*) OVER () AS total_groups FROM g
      ORDER BY ${orderBy}, rep
      LIMIT ${limit} OFFSET ${offset}
    `);
    let total = Number(rows[0]?.total_groups ?? 0);
    if (rows.length === 0 && offset > 0) {
      const { rows: countRows } = await db.execute<
        QueryResultRow & { n: string }
      >(
        sql`SELECT COUNT(*) AS n FROM (SELECT 1 FROM ${errorLogs} WHERE ${where} GROUP BY "error_logs"."message", "error_logs"."resolved") s`,
      );
      total = Number(countRows[0]?.n ?? 0);
    }
    return {
      reps: rows.map((r) => r.rep),
      windowByRep: new Map(rows.map((r) => [r.rep, Number(r.hits)])),
      total,
    };
  }

  private static seriesKeySql(
    split: ErrorLogsRequestOutput["split"],
  ): SQL<string> {
    switch (split) {
      case ErrorLogTrendSplit.LEVEL:
        return sql<string>`${errorLogs.level}`;
      case ErrorLogTrendSplit.SOURCE:
        return sql<string>`CASE WHEN ${ErrorLogsRepository.isClientSql()} THEN ${ERROR_LOG_TREND_SERIES.CLIENT} ELSE ${ERROR_LOG_TREND_SERIES.SERVER} END`;
      default:
        return sql<string>`CASE WHEN date_trunc('day', ${errorLogs.firstSeen}) = ${errorLogDaily.day} THEN ${ERROR_LOG_TREND_SERIES.NEW} ELSE ${ERROR_LOG_TREND_SERIES.RECURRING} END`;
    }
  }

  private static seriesKeys(
    split: ErrorLogsRequestOutput["split"],
  ): readonly string[] {
    switch (split) {
      case ErrorLogTrendSplit.LEVEL:
        return [ERROR_LOG_TREND_SERIES.ERROR, ERROR_LOG_TREND_SERIES.WARN];
      case ErrorLogTrendSplit.SOURCE:
        return [ERROR_LOG_TREND_SERIES.SERVER, ERROR_LOG_TREND_SERIES.CLIENT];
      default:
        return [ERROR_LOG_TREND_SERIES.NEW, ERROR_LOG_TREND_SERIES.RECURRING];
    }
  }

  /** Distinct users or leads hit by the filtered classes, period vs previous. */
  private static async affectedKpi(
    column: "user_ids" | "lead_ids",
    filterSql: SQL | undefined,
    win: AnalyticsWindow,
  ): Promise<Array<{ current: string; previous: string }>> {
    const ids = sql.raw(`d.${column}`);
    const { rows } = await db.execute<
      QueryResultRow & { current: string; previous: string }
    >(sql`
      SELECT
        COUNT(DISTINCT x.v) FILTER (WHERE ${inWindowSql(sql`d.day`, win)}) AS current,
        COUNT(DISTINCT x.v) FILTER (WHERE ${inPreviousWindowSql(sql`d.day`, win)}) AS previous
      FROM ${errorLogDaily} d
      CROSS JOIN LATERAL jsonb_array_elements_text(${ids}) AS x(v)
      JOIN ${errorLogs} ON ${errorLogs.fingerprint} = d.fingerprint
      WHERE ${filterSql ?? sql`TRUE`}
    `);
    return rows;
  }

  /** Distinct user or lead ids per fingerprint inside the period. */
  private static async affectedIds(
    column: "user_ids" | "lead_ids",
    fingerprints: string[],
    win: AnalyticsWindow,
  ): Promise<Array<{ fingerprint: string; ids: string[] | null }>> {
    const ids = sql.raw(`d.${column}`);
    const { rows } = await db.execute<
      QueryResultRow & { fingerprint: string; ids: string[] | null }
    >(sql`
      SELECT d.fingerprint, array_agg(DISTINCT x.v ORDER BY x.v) AS ids
      FROM ${errorLogDaily} d
      CROSS JOIN LATERAL jsonb_array_elements_text(${ids}) AS x(v)
      WHERE d.fingerprint IN (${sql.join(
        fingerprints.map((f) => sql`${f}`),
        sql`, `,
      )})
        AND ${inWindowSql(sql`d.day`, win)}
      GROUP BY d.fingerprint
    `);
    return rows;
  }

  static async updateStatus(
    data: ErrorLogsPatchRequestOutput,
    t: ErrorLogsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorLogsPatchResponseOutput>> {
    try {
      if (data.similarTo) {
        const updated = await db
          .update(errorLogs)
          .set({ resolved: data.resolved })
          .where(
            and(
              sql`${errorLogs.message} = (SELECT e.message FROM ${errorLogs} e WHERE e.fingerprint = ${data.similarTo})`,
              eq(errorLogs.resolved, !data.resolved),
            ),
          )
          .returning({ fingerprint: errorLogs.fingerprint });
        if (updated.length === 0) {
          const [target] = await db
            .select({ fingerprint: errorLogs.fingerprint })
            .from(errorLogs)
            .where(eq(errorLogs.fingerprint, data.similarTo))
            .limit(1);
          if (!target) {
            return fail({
              message: t("patch.errors.notFound.title"),
              errorType: ErrorResponseTypes.NOT_FOUND,
            });
          }
        }
        return success({
          responseFingerprint: data.similarTo,
          responseResolved: data.resolved,
          affectedRows: updated.length,
          affectedFingerprints: updated.map((row) => row.fingerprint),
        });
      }
      if (data.fingerprints && data.fingerprints.length > 0) {
        const updated = await db
          .update(errorLogs)
          .set({ resolved: data.resolved })
          .where(inArray(errorLogs.fingerprint, data.fingerprints))
          .returning({ fingerprint: errorLogs.fingerprint });
        if (updated.length === 0) {
          return fail({
            message: t("patch.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
        return success({
          responseFingerprint: updated.map((r) => r.fingerprint).join(","),
          responseResolved: data.resolved,
          affectedRows: updated.length,
        });
      }
      let fingerprint = data.fingerprint;
      if (!fingerprint && data.id) {
        // Row id from the list: full uuid or a short prefix (the list and
        // agents print the first 8 characters). Resolve to the fingerprint,
        // refusing an ambiguous prefix.
        const idPrefix = data.id.toLowerCase();
        const matches = await db
          .select({ fingerprint: errorLogs.fingerprint })
          .from(errorLogs)
          .where(sql`${errorLogs.id}::text LIKE ${`${idPrefix}%`}`)
          .limit(2);
        if (matches.length > 1) {
          return fail({
            message: t("errors.idNotUnique", {
              id: data.id,
              count: matches.length,
            }),
            errorType: ErrorResponseTypes.VALIDATION_ERROR,
          });
        }
        fingerprint = matches[0]?.fingerprint;
        if (!fingerprint) {
          return fail({
            message: t("patch.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
          });
        }
      }
      if (!fingerprint) {
        return fail({
          message: t("errors.missingTarget"),
          errorType: ErrorResponseTypes.VALIDATION_ERROR,
        });
      }

      const result = await db
        .update(errorLogs)
        .set({ resolved: data.resolved })
        .where(eq(errorLogs.fingerprint, fingerprint))
        .returning({ id: errorLogs.id });

      logger.debug(
        `Updated ${result.length.toString()} rows for fingerprint ${fingerprint}`,
      );

      if (result.length === 0) {
        // Fingerprint matched no row - report it instead of a false success,
        // which previously made a typo'd/stale fingerprint indistinguishable
        // from a real update (both rendered the same "success" response).
        return fail({
          message: t("patch.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
        });
      }

      return success({
        responseFingerprint: fingerprint,
        responseResolved: data.resolved,
        affectedRows: result.length,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update error log status", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.updateErrorLog", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
