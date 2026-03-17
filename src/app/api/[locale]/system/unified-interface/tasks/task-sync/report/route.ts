/**
 * Task Report Route Handler
 * Validates API key, applies execution result to local task record.
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { endpoints } from "./definition";
import { TaskReportRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, logger, locale }) =>
      TaskReportRepository.processReport(data, logger, locale),
  },
});
