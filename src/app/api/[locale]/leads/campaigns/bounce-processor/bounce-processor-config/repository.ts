/**
 * Bounce Processor Configuration Repository
 * Manages the bounce-processor cron task in the database
 */

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { db } from "@/app/api/[locale]/system/db";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  cronTasks,
  type NewCronTask,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/db";
import {
  CronTaskPriority,
  TaskCategory,
} from "@/app/api/[locale]/system/unified-interface/tasks/enum";
import type { JsonValue } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";

import type { JwtPayloadType } from "../../../../user/auth/types";
import type { scopedTranslation } from "./i18n";
import type {
  BounceProcessorConfigGetResponseOutput,
  BounceProcessorConfigPutResponseOutput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

const TASK_ID = "bounce-processor";
const ROUTE_ID = "bounce-processor";

function getDefaultConfig(): BounceProcessorConfigGetResponseOutput {
  return {
    enabled: false,
    dryRun: false,
    batchSize: 100,
    schedule: "*/15 * * * *",
    priority: CronTaskPriority.MEDIUM,
    timeout: 300000,
    retries: 3,
    retryDelay: 30000,
  };
}

export class BounceProcessorConfigRepository {
  static async getConfig(
    user: JwtPayloadType,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BounceProcessorConfigGetResponseOutput>> {
    try {
      logger.info("Fetching bounce processor config", { userId: user.id });

      const [existing] = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, TASK_ID))
        .limit(1);

      if (!existing) {
        return success(getDefaultConfig());
      }

      const defaults = getDefaultConfig();
      const taskInput = existing.taskInput as Record<string, JsonValue> | null;

      return success({
        enabled: existing.enabled,
        dryRun:
          typeof taskInput?.dryRun === "boolean"
            ? taskInput.dryRun
            : defaults.dryRun,
        batchSize:
          typeof taskInput?.batchSize === "number"
            ? taskInput.batchSize
            : defaults.batchSize,
        schedule: existing.schedule,
        priority:
          (existing.priority as BounceProcessorConfigGetResponseOutput["priority"]) ??
          defaults.priority,
        timeout: existing.timeout ?? defaults.timeout,
        retries: existing.retries ?? defaults.retries,
        retryDelay: existing.retryDelay ?? defaults.retryDelay,
      });
    } catch (error) {
      logger.error("Error fetching bounce processor config", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateConfig(
    data: BounceProcessorConfigGetResponseOutput,
    user: JwtPayloadType,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BounceProcessorConfigPutResponseOutput>> {
    try {
      logger.info("Updating bounce processor config", {
        userId: user.id,
        enabled: data.enabled,
        dryRun: data.dryRun,
      });

      if (!data.enabled) {
        // Remove the cron task when disabled
        await db.delete(cronTasks).where(eq(cronTasks.id, TASK_ID));
        logger.debug("Removed bounce-processor cron task (disabled)");
        return success();
      }

      const cronData: NewCronTask = {
        id: TASK_ID,
        routeId: ROUTE_ID,
        displayName: "Bounce Processor",
        description:
          "Scan IMAP for bounce notifications and update lead status",
        version: "1.0.0",
        category: TaskCategory.LEAD_MANAGEMENT,
        schedule: data.schedule,
        enabled: true,
        priority: data.priority,
        timeout: data.timeout,
        retries: data.retries,
        retryDelay: data.retryDelay,
        taskInput: {
          dryRun: data.dryRun,
          batchSize: data.batchSize,
        },
        updatedAt: new Date(),
      };

      const [existing] = await db
        .select({ id: cronTasks.id })
        .from(cronTasks)
        .where(eq(cronTasks.id, TASK_ID))
        .limit(1);

      if (existing) {
        await db
          .update(cronTasks)
          .set(cronData)
          .where(eq(cronTasks.id, TASK_ID));
      } else {
        await db.insert(cronTasks).values(cronData);
      }

      logger.debug("Saved bounce-processor cron task");
      return success();
    } catch (error) {
      logger.error("Error updating bounce processor config", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
