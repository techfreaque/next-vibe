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

import type { JwtPayloadType } from "../../../../user/auth/types";
import { BOUNCE_PROCESSOR_ALIAS } from "../constants";
import type {
  BounceProcessorConfigGetResponseOutput,
  BounceProcessorConfigPutResponseOutput,
} from "./definition";
import type { BounceProcessorConfigT } from "./i18n";

export class BounceProcessorConfigRepository {
  private static getDefaultConfig(): BounceProcessorConfigGetResponseOutput {
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

  static async getConfig(
    user: JwtPayloadType,
    t: BounceProcessorConfigT,
    logger: EndpointLogger,
  ): Promise<ResponseType<BounceProcessorConfigGetResponseOutput>> {
    try {
      logger.info("Fetching bounce processor config", { userId: user.id });

      const [existing] = await db
        .select()
        .from(cronTasks)
        .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS))
        .limit(1);

      if (!existing) {
        return success(BounceProcessorConfigRepository.getDefaultConfig());
      }

      const defaults = BounceProcessorConfigRepository.getDefaultConfig();
      const taskInput = existing.taskInput;

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
        priority: existing.priority ?? defaults.priority,
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
    t: BounceProcessorConfigT,
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
        await db
          .delete(cronTasks)
          .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS));
        logger.debug("Removed bounce-processor cron task (disabled)");
        return success();
      }

      const cronData: NewCronTask = {
        id: BOUNCE_PROCESSOR_ALIAS,
        shortId: BOUNCE_PROCESSOR_ALIAS,
        routeId: BOUNCE_PROCESSOR_ALIAS,
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
        .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS))
        .limit(1);

      if (existing) {
        await db
          .update(cronTasks)
          .set(cronData)
          .where(eq(cronTasks.id, BOUNCE_PROCESSOR_ALIAS));
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
