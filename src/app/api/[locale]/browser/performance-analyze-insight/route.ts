/**
 * PerformanceAnalyzeInsight Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceAnalyzeInsightEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceAnalyzeInsightEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeMCPTool(
        {
          toolName: "performance-analyze-insight",
          args: filterUndefinedArgs({
            insightSetId: data.insightSetId,
            insightName: data.insightName,
          }),
        },
        logger,
      );
    },
  },
});
