/**
 * PerformanceAnalyzeInsight Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceAnalyzeInsightEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceAnalyzeInsightEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeMCPTool(
        {
          toolName: BrowserTool.PERFORMANCE_ANALYZE_INSIGHT,
          args: filterUndefinedArgs({
            insightSetId: data.insightSetId,
            insightName: data.insightName,
          }),
        },
        t,
        logger,
      ),
  },
});
