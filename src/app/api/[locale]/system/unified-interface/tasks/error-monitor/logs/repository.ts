/**
 * Error Logs Repository
 * Data access layer for browsing error logs
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
  ErrorLogsRequestOutput,
  ErrorLogsResponseOutput,
} from "./definition";
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

      if (data?.source) {
        conditions.push(eq(errorLogs.source, data.source));
      }
      if (data?.level) {
        conditions.push(eq(errorLogs.level, data.level));
      }
      if (data?.endpoint) {
        conditions.push(ilike(errorLogs.endpoint, `%${data.endpoint}%`));
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
          source: errorLogs.source,
          level: errorLogs.level,
          message: errorLogs.message,
          endpoint: errorLogs.endpoint,
          errorType: errorLogs.errorType,
          errorCode: errorLogs.errorCode,
          stackTrace: errorLogs.stackTrace,
          metadata: errorLogs.metadata,
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
          source: row.source,
          level: row.level,
          message: row.message,
          endpoint: row.endpoint,
          errorType: row.errorType,
          errorCode: row.errorCode,
          stackTrace: row.stackTrace,
          metadata: row.metadata as Record<
            string,
            string | number | boolean
          > | null,
          createdAt: row.createdAt.toISOString(),
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
}
