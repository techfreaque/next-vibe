/**
 * Error Logs Repository
 * Data access layer for browsing error logs and toggling resolved status.
 * Each fingerprint = one row (dedup on write), so no GROUP BY needed.
 */

import "server-only";

import { and, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
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
import type { ErrorLogsT } from "./i18n";
import type { EndpointLogger } from "../../types";
import type { LoggerMetadata } from "../../types";

import { errorLogs } from "../db";

/**
 * Metadata is JSONB — at rest it is plain JSON (Errors/Dates already
 * serialized), so it is WidgetData-shaped. Parse each entry through
 * WidgetDataSchema to get the response's WidgetData[] type honestly (validate,
 * don't cast). Returns null for an empty/absent payload.
 */
function normalizeMetadata(
  raw: LoggerMetadata[] | null | undefined,
): WidgetData[] | null {
  const arr = Array.isArray(raw)
    ? raw
    : raw !== null && raw !== undefined
      ? [raw]
      : null;
  if (!arr || arr.length === 0) {
    return null;
  }
  return arr.map((entry) => WidgetDataSchema.parse(entry));
}
import type {
  ErrorLogsPatchRequestOutput,
  ErrorLogsPatchResponseOutput,
  ErrorLogsRequestOutput,
  ErrorLogsResponseOutput,
} from "./definition";
import { ErrorLogStatusFilter } from "./enum";

export class ErrorLogsRepository {
  static async getLogs(
    data: ErrorLogsRequestOutput,
    t: ErrorLogsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorLogsResponseOutput>> {
    try {
      const limit =
        data?.limit && Number(data.limit) > 0 ? Number(data.limit) : 50;
      const offset = data?.offset ? Number(data.offset) : 0;

      const conditions = [];

      // Status filter (default ACTIVE = unresolved only)
      if (data?.status === ErrorLogStatusFilter.ACTIVE) {
        conditions.push(eq(errorLogs.resolved, false));
      } else if (data?.status === ErrorLogStatusFilter.RESOLVED) {
        conditions.push(eq(errorLogs.resolved, true));
      }

      if (data?.search) {
        conditions.push(ilike(errorLogs.message, `%${data.search}%`));
      }
      if (data?.errorType) {
        conditions.push(ilike(errorLogs.errorType, `%${data.errorType}%`));
      }
      if (data?.startDate) {
        const startDate =
          data.startDate instanceof Date
            ? data.startDate
            : new Date(data.startDate);
        if (!isNaN(startDate.getTime())) {
          conditions.push(gte(errorLogs.createdAt, startDate));
        }
      }
      if (data?.endDate) {
        const endDate =
          data.endDate instanceof Date ? data.endDate : new Date(data.endDate);
        if (!isNaN(endDate.getTime())) {
          conditions.push(lte(errorLogs.createdAt, endDate));
        }
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
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
        })
        .from(errorLogs)
        .where(where)
        .orderBy(desc(errorLogs.createdAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: count() })
        .from(errorLogs)
        .where(where);

      const totalCount = countResult?.count ?? 0;

      const [unresolvedResult] = await db
        .select({ count: count() })
        .from(errorLogs)
        .where(eq(errorLogs.resolved, false));

      const unresolvedCount = unresolvedResult?.count ?? 0;

      logger.debug(`Fetched ${rows.length.toString()} error log entries`);

      const response: ErrorLogsResponseOutput = {
        logs: rows.map((row) => ({
          id: row.id,
          message: row.message,
          errorType: row.errorType,
          stackTrace: row.stackTrace,
          // Metadata is stored as JSONB — at rest it is plain JSON (Errors /
          // Dates already serialized), so it IS WidgetData-shaped. Normalize the
          // read value through a JSON round-trip to the response's WidgetData
          // type (faithful, not a cast — the wire/DB form is already JSON).
          metadata: normalizeMetadata(row.metadata),
          fingerprint: row.fingerprint,
          occurrences: row.occurrences,
          resolved: row.resolved,
          firstSeen: row.firstSeen.toISOString(),
          createdAt: row.createdAt.toISOString(),
          level: row.level,
        })),
        totalCount,
        hasMore: totalCount > offset + limit,
        unresolvedCount,
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

  static async updateStatus(
    data: ErrorLogsPatchRequestOutput,
    t: ErrorLogsT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorLogsPatchResponseOutput>> {
    try {
      const result = await db
        .update(errorLogs)
        .set({ resolved: data.resolved })
        .where(eq(errorLogs.fingerprint, data.fingerprint))
        .returning({ id: errorLogs.id });

      logger.debug(
        `Updated ${result.length.toString()} rows for fingerprint ${data.fingerprint}`,
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
        responseFingerprint: data.fingerprint,
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
