/**
 * Error Logs Repository
 * Data access layer for browsing error logs and toggling resolved status.
 * Each fingerprint = one row (dedup on write), so no GROUP BY needed.
 */

import "server-only";

import { and, count, desc, eq, gte, ilike, lte } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { errorLogs } from "../db";
import type {
  ErrorLogsPatchRequestOutput,
  ErrorLogsPatchResponseOutput,
  ErrorLogsRequestOutput,
  ErrorLogsResponseOutput,
} from "./definition";
import { ErrorLogStatusFilter } from "./enum";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class ErrorLogsRepository {
  static async getLogs(
    data: ErrorLogsRequestOutput,
    t: ModuleT,
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
        conditions.push(gte(errorLogs.createdAt, new Date(data.startDate)));
      }
      if (data?.endDate) {
        conditions.push(lte(errorLogs.createdAt, new Date(data.endDate)));
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

      logger.debug(`Fetched ${rows.length.toString()} error log entries`);

      const response: ErrorLogsResponseOutput = {
        logs: rows.map((row) => ({
          id: row.id,
          message: row.message,
          errorType: row.errorType,
          stackTrace: row.stackTrace,
          metadata: row.metadata,
          fingerprint: row.fingerprint,
          occurrences: row.occurrences,
          resolved: row.resolved,
          firstSeen: row.firstSeen.toISOString(),
          createdAt: row.createdAt.toISOString(),
          level: row.level,
        })),
        totalCount,
        hasMore: totalCount > offset + limit,
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch error logs", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.fetchErrorLogs"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }

  static async updateStatus(
    data: ErrorLogsPatchRequestOutput,
    t: ModuleT,
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
        message: t("errors.updateErrorLog"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}
