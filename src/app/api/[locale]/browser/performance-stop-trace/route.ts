/**
 * PerformanceStopTrace Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import performanceStopTraceEndpoints, {
  type PerformanceStopTraceResponseOutput,
} from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStopTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ logger }) => {
      return executeMCPTool(
        {
          toolName: "performance-stop-trace",
          args: filterUndefinedArgs({}),
        },
        logger,
      ) as Promise<ResponseType<PerformanceStopTraceResponseOutput>>;
    },
  },
});
