import "server-only";

import { and, count, eq } from "drizzle-orm";
import {
  type ResponseType,
  success,
} from "next-vibe/core/route/response.schema";
import { db } from "next-vibe/database";

import { getUnhealthyConnectionCount } from "../../remote-connection/health-summary";
import { getFailingTaskCount } from "../../tasks/cron/health-summary";
import { errorLogs } from "../error-monitor/db";
import { type OperationsSummary, summarizeOperations } from "./summary";

async function countOpenErrors(): Promise<number> {
  const [result] = await db
    .select({ total: count() })
    .from(errorLogs)
    .where(and(eq(errorLogs.resolved, false), eq(errorLogs.level, "error")));
  return result?.total ?? 0;
}

function availableCount(result: PromiseSettledResult<number>): number | null {
  return result.status === "fulfilled" ? result.value : null;
}

export async function getOperationsSummary(): Promise<
  ResponseType<{ summary: OperationsSummary }>
> {
  const day = new Date().toISOString().slice(0, 10);
  const [errors, tasks, connections] = await Promise.allSettled([
    countOpenErrors(),
    getFailingTaskCount(),
    getUnhealthyConnectionCount(),
  ]);
  return success({
    summary: summarizeOperations(day, {
      errors: availableCount(errors),
      tasks: availableCount(tasks),
      connections: availableCount(connections),
    }),
  });
}
