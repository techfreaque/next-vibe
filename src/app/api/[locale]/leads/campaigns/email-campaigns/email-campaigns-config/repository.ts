/**
 * Email Campaigns Configuration Repository
 * Manages the email-campaigns cron task in the database
 */

import { eq } from "drizzle-orm";
import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";
import { Environment } from "next-vibe/shared/utils/env-util";

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
import { env } from "@/config/env";

import type { JwtPayloadType } from "../../../../user/auth/types";
import type { scopedTranslation } from "./i18n";
import type {
  EmailCampaignsConfigGetResponseOutput,
  EmailCampaignsConfigPutResponseOutput,
} from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

const TASK_ID = "email-campaigns";
const ROUTE_ID = "email-campaigns";

function getDefaultConfig(): EmailCampaignsConfigGetResponseOutput {
  const isProduction = env.NODE_ENV === Environment.PRODUCTION;
  return {
    enabled: false,
    dryRun: !isProduction,
    batchSize: isProduction ? 100 : 10,
    maxEmailsPerRun: isProduction ? 500 : 10,
    schedule: isProduction ? "*/1 7-15 * * 1-5" : "*/3 * * * *",
    priority: CronTaskPriority.HIGH,
    timeout: 1800000,
    retries: 3,
    retryDelay: 30000,
  };
}

export class EmailCampaignsConfigRepository {
  static async getConfig(
    user: JwtPayloadType,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignsConfigGetResponseOutput>> {
    try {
      logger.info("Fetching email campaigns config", { userId: user.id });

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
        maxEmailsPerRun:
          typeof taskInput?.maxEmailsPerRun === "number"
            ? taskInput.maxEmailsPerRun
            : defaults.maxEmailsPerRun,
        schedule: existing.schedule,
        priority:
          (existing.priority as EmailCampaignsConfigGetResponseOutput["priority"]) ??
          defaults.priority,
        timeout: existing.timeout ?? defaults.timeout,
        retries: existing.retries ?? defaults.retries,
        retryDelay: existing.retryDelay ?? defaults.retryDelay,
      });
    } catch (error) {
      logger.error("Error fetching email campaigns config", parseError(error));
      return fail({
        message: t("get.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  static async updateConfig(
    data: EmailCampaignsConfigGetResponseOutput,
    user: JwtPayloadType,
    t: ModuleT,
    logger: EndpointLogger,
  ): Promise<ResponseType<EmailCampaignsConfigPutResponseOutput>> {
    try {
      logger.info("Updating email campaigns config", {
        userId: user.id,
        enabled: data.enabled,
        dryRun: data.dryRun,
      });

      if (!data.enabled) {
        // Remove the cron task when disabled
        await db.delete(cronTasks).where(eq(cronTasks.id, TASK_ID));
        logger.debug("Removed email-campaigns cron task (disabled)");
        return success();
      }

      const cronData: NewCronTask = {
        id: TASK_ID,
        shortId: TASK_ID,
        routeId: ROUTE_ID,
        displayName: "Email Campaigns",
        description: "Send automated email campaigns to leads",
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
          maxEmailsPerRun: data.maxEmailsPerRun,
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

      logger.debug("Saved email-campaigns cron task");
      return success();
    } catch (error) {
      logger.error("Error updating email campaigns config", parseError(error));
      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
