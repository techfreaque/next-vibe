/**
 * PerformanceStopTrace Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import performanceStopTraceEndpoints, {
  type PerformanceStopTraceResponseOutput,
} from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: performanceStopTraceEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      // Explicitly void unused data to satisfy linter
      void data;
      return executeMCPTool(
        {
          toolName: "performance-stop-trace",
          args: filterUndefinedArgs({}),
        },
        user,
        logger,
        locale,
      ) as Promise<ResponseType<PerformanceStopTraceResponseOutput>>;
    },
  },
});
