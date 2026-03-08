/**
 * Task Execute API Route
 * Handles single task execution by ID
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import taskExecuteEndpoints from "./definition";
import { TaskExecuteRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: taskExecuteEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger, t }) =>
      TaskExecuteRepository.executeTask(data, user, locale, logger, t),
  },
});
