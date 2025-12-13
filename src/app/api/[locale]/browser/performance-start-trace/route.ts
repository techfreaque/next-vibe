/**
 * PerformanceStartTrace Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import performanceStartTraceEndpoints from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStartTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeMCPTool(
        {
          toolName: "performance-start-trace",
          args: filterUndefinedArgs({
            reload: data.reload,
            autoStop: data.autoStop,
          }),
        },
        logger,
      );
    },
  },
});
