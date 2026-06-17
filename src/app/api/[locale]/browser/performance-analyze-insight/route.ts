/**
 * PerformanceAnalyzeInsight Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import performanceAnalyzeInsightEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceAnalyzeInsightEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.PERFORMANCE_ANALYZE_INSIGHT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            insightSetId: data.insightSetId,
            insightName: data.insightName,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
