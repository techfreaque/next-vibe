/**
 * Pulse Execution History Repository
 */

import "server-only";

import { and, avg, count, desc, eq, gte, lte, sql } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { PulseExecutionStatus } from "../../enum";
import { pulseExecutions } from "../db";
import type {
  PulseHistoryRequestOutput,
  PulseHistoryResponseOutput,
} from "./definition";

export class PulseHistoryRepository {
  static async getHistory(
    data: PulseHistoryRequestOutput,
    logger: EndpointLogger,
  ): Promise<ResponseType<PulseHistoryResponseOutput>> {
    try {
      const limit =
        data?.limit && Number(data.limit) > 0 ? Number(data.limit) : 50;
      const offset = data?.offset ? Number(data.offset) : 0;

      const conditions = [];

      if (data?.status) {
        conditions.push(
          eq(
            pulseExecutions.status,
            data.status as (typeof PulseExecutionStatus)[keyof typeof PulseExecutionStatus],
          ),
        );
      }
      if (data?.startDate) {
        conditions.push(
          gte(pulseExecutions.startedAt, new Date(data.startDate)),
        );
      }
      if (data?.endDate) {
        conditions.push(lte(pulseExecutions.startedAt, new Date(data.endDate)));
      }

      const where = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select()
        .from(pulseExecutions)
        .where(where)
        .orderBy(desc(pulseExecutions.startedAt))
        .limit(limit)
        .offset(offset);

      const [countResult] = await db
        .select({ count: count() })
        .from(pulseExecutions)
        .where(where);

      const totalCount = countResult?.count ?? 0;

      const [statsResult] = await db
        .select({
          totalExecutions: count(),
          successfulExecutions: count(
            sql`CASE WHEN ${pulseExecutions.status} = ${PulseExecutionStatus.SUCCESS} THEN 1 END`,
          ),
          failedExecutions: count(
            sql`CASE WHEN ${pulseExecutions.status} = ${PulseExecutionStatus.FAILURE} THEN 1 END`,
          ),
          averageDuration: avg(pulseExecutions.durationMs),
        })
        .from(pulseExecutions)
        .where(where);

      const successRate =
        statsResult && Number(statsResult.totalExecutions) > 0
          ? Math.round(
              (Number(statsResult.successfulExecutions) /
                Number(statsResult.totalExecutions)) *
                100,
            )
          : 0;

      const executions: PulseHistoryResponseOutput["executions"] = rows.map(
        (r) => ({
          id: r.id,
          pulseId: r.pulseId,
          status: r.status,
          healthStatus: r.healthStatus,
          startedAt: r.startedAt.toISOString(),
          completedAt: r.completedAt?.toISOString() ?? null,
          durationMs: r.durationMs,
          totalTasksDiscovered: r.totalTasksDiscovered,
          tasksDue: (r.tasksDue as string[]) ?? [],
          tasksExecuted: (r.tasksExecuted as string[]) ?? [],
          tasksSucceeded: (r.tasksSucceeded as string[]) ?? [],
          tasksFailed: (r.tasksFailed as string[]) ?? [],
          tasksSkipped: (r.tasksSkipped as string[]) ?? [],
          totalExecutionTimeMs: r.totalExecutionTimeMs,
          environment: r.environment,
          triggeredBy: r.triggeredBy,
          createdAt: r.createdAt.toISOString(),
        }),
      );

      logger.debug(`Fetched ${executions.length} pulse executions`);

      return success({
        executions,
        totalCount,
        hasMore: totalCount > offset + limit,
        summary: {
          totalExecutions: Number(statsResult?.totalExecutions ?? 0),
          successfulExecutions: Number(statsResult?.successfulExecutions ?? 0),
          failedExecutions: Number(statsResult?.failedExecutions ?? 0),
          averageDuration: statsResult?.averageDuration
            ? Math.round(Number(statsResult.averageDuration))
            : null,
          successRate,
        },
      });
    } catch (error) {
      logger.error("Failed to fetch pulse history", parseError(error));
      return fail({
        message: ErrorResponseTypes.INTERNAL_ERROR.errorKey,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
