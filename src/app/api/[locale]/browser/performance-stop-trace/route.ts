/**
 * PerformanceStopTrace Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceStopTraceEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStopTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ logger }) =>
      executeMCPTool(
        {
          toolName: "performance-stop-trace",
          args: filterUndefinedArgs({}),
        },
        logger,
      ),
  },
});
