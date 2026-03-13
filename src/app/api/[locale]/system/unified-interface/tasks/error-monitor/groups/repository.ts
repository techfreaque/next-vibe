/**
 * Error Groups Repository
 * Data access layer for browsing deduplicated errors and toggling resolved status.
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
  ErrorGroupsGetRequestOutput,
  ErrorGroupsGetResponseOutput,
  ErrorGroupsPatchRequestOutput,
  ErrorGroupsPatchResponseOutput,
} from "./definition";
import { ErrorGroupStatusFilter } from "./enum";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class ErrorGroupsRepository {
  static async getGroups(
    data: ErrorGroupsGetRequestOutput,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorGroupsGetResponseOutput>> {
    try {
      const limit =
        data?.limit && Number(data.limit) > 0 ? Number(data.limit) : 50;
      const offset = data?.offset ? Number(data.offset) : 0;

      const conditions = [];

      // Status filter
      if (data?.status === ErrorGroupStatusFilter.ACTIVE) {
        conditions.push(eq(errorLogs.resolved, false));
      } else if (data?.status === ErrorGroupStatusFilter.RESOLVED) {
        conditions.push(eq(errorLogs.resolved, true));
      }

      if (data?.errorType) {
        conditions.push(ilike(errorLogs.errorType, `%${data.errorType}%`));
      }
      if (data?.search) {
        conditions.push(ilike(errorLogs.message, `%${data.search}%`));
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
          fingerprint: errorLogs.fingerprint,
          message: errorLogs.message,
          errorType: errorLogs.errorType,
          occurrences: errorLogs.occurrences,
          firstSeen: errorLogs.createdAt,
          lastSeen: errorLogs.createdAt,
          resolved: errorLogs.resolved,
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

      logger.debug(`Fetched ${rows.length.toString()} error groups`);

      const response: ErrorGroupsGetResponseOutput = {
        groups: rows.map((row) => ({
          fingerprint: row.fingerprint,
          message: row.message,
          errorType: row.errorType,
          occurrences: row.occurrences,
          firstSeen: row.firstSeen.toISOString(),
          lastSeen: row.lastSeen.toISOString(),
          resolved: row.resolved,
        })),
        totalCount,
        hasMore: totalCount > offset + limit,
      };

      return success(response);
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch error groups", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.fetchErrorGroups"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }

  static async updateGroupStatus(
    data: ErrorGroupsPatchRequestOutput,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<ErrorGroupsPatchResponseOutput>> {
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
      logger.error("Failed to update error group status", {
        error: parsedError.message,
      });

      return fail({
        message: t("errors.updateErrorGroup"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}
