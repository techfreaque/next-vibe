/**
 * PerformanceStartTrace Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceStartTraceEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStartTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeMCPTool(
        {
          toolName: BrowserTool.PERFORMANCE_START_TRACE,
          args: filterUndefinedArgs({
            reload: data.reload,
            autoStop: data.autoStop,
            filePath: data.filePath,
          }),
        },
        t,
        logger,
      ),
  },
});
