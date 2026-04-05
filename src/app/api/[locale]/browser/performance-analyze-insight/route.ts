/**
 * PerformanceAnalyzeInsight Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import performanceAnalyzeInsightEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceAnalyzeInsightEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.PERFORMANCE_ANALYZE_INSIGHT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            insightSetId: data.insightSetId,
            insightName: data.insightName,
          }),
        },
        t,
        logger,
      ),
  },
});
