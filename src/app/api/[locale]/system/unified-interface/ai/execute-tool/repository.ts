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

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import { DefaultFolderId } from "@/app/api/[locale]/agent/chat/config";
import { db } from "@/app/api/[locale]/system/db";
import type { CliRequestData } from "@/app/api/[locale]/system/unified-interface/cli/runtime/parsing";
import { RouteExecutionExecutor } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/executor";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { Platform } from "@/app/api/[locale]/system/unified-interface/shared/types/platform";
import { cronTasks } from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
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
  ): Promise<ResponseType<RouteExecuteResponseInput>> {
    try {
      const { toolName, input, instanceId } = data;

      // Remote execution path — create a one-shot task for the target instance
      if (instanceId && !user.isPublic) {
        logger.info("[RouteExecute] Creating remote task", {
          toolName,
          instanceId,
        });

        const taskId = `remote-${instanceId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

        await db.insert(cronTasks).values({
          id: taskId,
          routeId: toolName,
          displayName: `Remote: ${toolName}`,
          category: TaskCategory.SYSTEM,
          schedule: "* * * * *", // run every minute — runOnce disables after first execution
          priority: CronTaskPriority.HIGH,
          enabled: true,
          runOnce: true,
          taskInput: (input ?? {}) as Record<string, JsonValue>,
          outputMode: TaskOutputMode.STORE_ONLY,
          notificationTargets: [],
          tags: ["remote", instanceId],
          targetInstance: instanceId,
          userId: user.id,
        });

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
