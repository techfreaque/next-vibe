/**
 * PerformanceStopTrace Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceStopTraceEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStopTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeMCPTool(
        {
          toolName: BrowserTool.PERFORMANCE_STOP_TRACE,
          args: filterUndefinedArgs({
            filePath: data.filePath,
          }),
        },
        t,
        logger,
      ),
  },
});
