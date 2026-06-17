/**
 * PerformanceStopTrace Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import performanceStopTraceEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStopTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.PERFORMANCE_STOP_TRACE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            filePath: data.filePath,
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
