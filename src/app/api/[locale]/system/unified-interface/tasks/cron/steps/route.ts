/**
 * Cron Task Steps Route Handler
 * PUT /api/[locale]/system/unified-interface/tasks/cron/steps
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { updateTaskSteps } from "./repository";

export const { PUT, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.PUT]: {
    handler: async ({ data, urlPathParams, user, logger }) => {
      return await updateTaskSteps(urlPathParams.id, data, user, logger);
    },
  },
});
