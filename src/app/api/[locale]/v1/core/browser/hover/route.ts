/**
 * Hover Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import hoverEndpoints, { type HoverResponseOutput } from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: hoverEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }): Promise<ResponseType<HoverResponseOutput>> => {
      return executeMCPTool(
        {
          toolName: "hover",
          args: filterUndefinedArgs({
            uid: data.uid,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
