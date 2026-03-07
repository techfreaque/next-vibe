/**
 * Route Execute Repository
 * Delegates execution to RouteExecutionExecutor.executeGenericHandler.
 * Auth is enforced by the target route handler.
 *
 * On success: returns success(result.data) — model gets the target's data flat.
 * On failure: propagates the target's fail() — model gets the error.
 *
 * Remote execution (instanceId provided):
 * Creates a one-shot cron task targeting the remote instance and returns
 * {taskId, status: "pending"} immediately. The local instance picks it up
 * on the next pulse.
 */

import "server-only";

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  DefaultFolderId,
  type ToolExecutionContext,
} from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/parsing";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { getPreferredName } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import {
  cronTaskExecutions,
  cronTasks,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  CronTaskStatus,
  TaskCategory,
  TaskOutputMode,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";
import type { CountryLanguage } from "@/i18n/core/config";

import type { scopedTranslation } from "../i18n";
import type {
  RouteExecuteRequestOutput,
  RouteExecuteResponseInput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

export class RouteExecuteRepository {
  static async execute(
    data: RouteExecuteRequestOutput,
    user: JwtPayloadType,
    locale: CountryLanguage,
    logger: EndpointLogger,
    t: ModuleT,
    streamContext?: ToolExecutionContext,
  ): Promise<ResponseType<RouteExecuteResponseInput>> {
    try {
      // Split prefixed tool ID: "hermes__ssh_exec_POST" → instanceId="hermes", toolName="ssh_exec_POST"
      // Prefixed form takes precedence over explicit instanceId prop
      let toolName = data.toolName;
      let instanceId = data.instanceId;
      const separatorIdx = toolName.indexOf("__");
      if (separatorIdx !== -1) {
        instanceId = toolName.slice(0, separatorIdx);
        toolName = toolName.slice(separatorIdx + 2);
      }

      const { input } = data;

      // Remote execution path — create a one-shot task for the target instance
      if (instanceId && !user.isPublic) {
        // Normalize incoming toolName to preferred name (alias > canonical).
        // Capabilities are stored using the preferred name so both alias and
        // full-path forms resolve to the same snapshot entry.
        toolName = getPreferredName(toolName);

        logger.info("[RouteExecute] Creating remote task", {
          toolName,
          instanceId,
        });

        // Validate toolName against stored capability snapshot
        const { getCapabilities } =
          await import("@/app/api/[locale]/user/remote-connection/repository");
        const capabilities = await getCapabilities(user.id, instanceId);

        if (capabilities === null) {
          // Capability snapshot not yet synced — fail closed.
          // Allowing through would let any tool name pass before the first sync,
          // creating a window where an attacker could call arbitrary remote endpoints.
          logger.warn(
            "[RouteExecute] no capability snapshot for instance — rejecting",
            {
              toolName,
              instanceId,
            },
          );
          return fail({
            message: t("executeTool.post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { toolName },
          });
        }

        const known = capabilities.some((c) => c.toolName === toolName);
        if (!known) {
          logger.warn("[RouteExecute] toolName not in capability snapshot", {
            toolName,
            instanceId,
            knownCount: capabilities.length,
          });
          return fail({
            message: t("executeTool.post.errors.notFound.title"),
            errorType: ErrorResponseTypes.NOT_FOUND,
            messageParams: { toolName },
          });
        }

        const { callbackMode } = data;

        // Get threadId and messageId from streamContext (set by the calling AI stream)
        const effectiveThreadId = streamContext?.threadId;
        const effectiveMessageId = streamContext?.aiMessageId;

        const taskId = `remote-${instanceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        // Merge routing metadata into taskInput so the remote instance can route the result
        const taskInput: Record<string, JsonValue> = {
          ...(input ?? {}),
          // Routing fields — remote pulse handler uses these
          __callbackMode: callbackMode ?? "task-done",
          ...(effectiveThreadId ? { __threadId: effectiveThreadId } : {}),
          ...(effectiveMessageId ? { __messageId: effectiveMessageId } : {}),
        };

        await db.insert(cronTasks).values({
          id: taskId,
          routeId: toolName,
          displayName: `Remote: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *", // run every minute — runOnce disables after first execution
          priority: CronTaskPriority.HIGH,
          enabled: true,
          runOnce: true,
          taskInput,
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["remote", instanceId],
          targetInstance: instanceId,
          userId: user.id,
        });

        // wait mode: long-poll task execution until complete or 60s timeout
        if (callbackMode === "wait") {
          const POLL_INTERVAL_MS = 3000;
          const TIMEOUT_MS = 60_000;
          const deadline = Date.now() + TIMEOUT_MS;

          while (Date.now() < deadline) {
            await new Promise<void>((resolve) => {
              setTimeout(resolve, POLL_INTERVAL_MS);
            });

            const [execution] = await db
              .select({
                status: cronTaskExecutions.status,
                result: cronTaskExecutions.result,
                error: cronTaskExecutions.error,
              })
              .from(cronTaskExecutions)
              .where(eq(cronTaskExecutions.taskId, taskId))
              .limit(1);

            if (!execution) {
              // Task not yet started — keep polling
              continue;
            }

            const { status } = execution;

            if (status === CronTaskStatus.COMPLETED) {
              logger.info("[RouteExecute] wait: task completed", {
                taskId,
                instanceId,
              });
              return success({ result: execution.result ?? undefined, taskId });
            }

            if (
              status === CronTaskStatus.FAILED ||
              status === CronTaskStatus.ERROR ||
              status === CronTaskStatus.TIMEOUT ||
              status === CronTaskStatus.CANCELLED
            ) {
              logger.warn("[RouteExecute] wait: task failed", {
                taskId,
                instanceId,
                status,
              });
              return success({
                result: { error: execution.error ?? { status }, taskId },
                taskId,
              });
            }

            // PENDING / RUNNING / SCHEDULED — keep polling
          }

          // Deadline exceeded
          logger.warn("[RouteExecute] wait: timeout", { taskId, instanceId });
          return success({ result: { error: "timeout", taskId }, taskId });
        }

        return success({
          result: undefined,
          taskId,
          status: "pending",
        });
      }

      logger.info("[RouteExecute] Executing route", { toolName });

      const result = await RouteExecutionExecutor.executeGenericHandler({
        toolName,
        data: input as CliRequestData,
        user,
        locale,
        logger,
        platform: Platform.MCP,
        streamContext: {
          rootFolderId: DefaultFolderId.CRON,
          threadId: undefined,
          aiMessageId: undefined,
          characterId: undefined,
          modelId: undefined,
          headless: undefined,
        },
      });

      if (!result.success) {
        return result;
      }

      // Wrap target's .data in `result` so MCP/UI renders it
      return success({ result: result.data });
    } catch (error) {
      const msg = parseError(error).message;
      logger.error("[RouteExecute] Failed", { error: msg });
      return fail({
        message: t("executeTool.post.errors.unknown.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: msg },
      });
    }
  }
}
