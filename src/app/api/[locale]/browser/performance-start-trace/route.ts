/**
 * PerformanceStartTrace Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceStartTraceEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStartTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeMCPTool(
        {
          toolName: "performance-start-trace",
          args: filterUndefinedArgs({
            reload: data.reload,
            autoStop: data.autoStop,
          }),
        },
        logger,
      ),
  },
});
