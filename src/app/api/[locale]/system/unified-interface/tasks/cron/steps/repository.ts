/**
 * Cron Task Steps Repository
 * Persists the steps array into the task's defaultConfig
 */

import "server-only";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
} from "next-vibe/shared/types/response.schema";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import { CronTasksRepository } from "@/app/api/[locale]/system/unified-interface/tasks/cron/repository";
import type { TaskConfig } from "@/app/api/[locale]/system/unified-interface/tasks/unified-runner/types";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import type {
  CronStepInput,
  CronTaskStepsPutRequestOutput,
  CronTaskStepsPutResponseOutput,
} from "./definition";

export async function updateTaskSteps(
  id: string,
  data: CronTaskStepsPutRequestOutput,
  user: JwtPayloadType,
  logger: EndpointLogger,
): Promise<ResponseType<CronTaskStepsPutResponseOutput>> {
  logger.debug("Updating steps for task", { id, stepCount: data.steps.length });

  // Load current task to merge defaultConfig
  const taskResult = await CronTasksRepository.getTaskById(id, user, logger);
  if (!taskResult.success) {
    return taskResult as ResponseType<CronTaskStepsPutResponseOutput>;
  }

  const currentConfig: TaskConfig =
    (taskResult.data.task.defaultConfig as TaskConfig) ?? {};

  // steps is a valid TaskConfigValue[] since each step satisfies the recursive structure
  const newConfig: TaskConfig = {
    ...currentConfig,
    steps: data.steps as TaskConfig["steps"],
  };

  const updateResult = await CronTasksRepository.updateTask(
    id,
    { defaultConfig: newConfig },
    user,
    logger,
  );

  if (!updateResult.success) {
    return fail({
      message:
        "app.api.system.unifiedInterface.tasks.cronSystem.steps.put.errors.internal.title",
      errorType: ErrorResponseTypes.INTERNAL_ERROR,
      cause: updateResult,
    });
  }

  return {
    success: true,
    data: {
      task: updateResult.data.task,
      success: true,
    },
  };
}

export type { CronStepInput };
