/**
 * ListPages Tool - Route Handler
 */

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import listPagesEndpoints, { type ListPagesResponseOutput } from "./definition";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listPagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      // Explicitly void unused data to satisfy linter
      void data;
      return executeMCPTool(
        {
          toolName: "list-pages",
          args: filterUndefinedArgs({}),
        },
        user,
        logger,
        locale,
      ) as Promise<ResponseType<ListPagesResponseOutput>>;
    },
  },
});
