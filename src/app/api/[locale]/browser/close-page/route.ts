/**
 * ClosePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeClosePage, filterUndefinedArgs } from "../shared/repository";
import closePageEndpoints, { type ClosePageResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: closePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeClosePage<ClosePageResponseOutput>(
        {
          toolName: "close-page",
          args: filterUndefinedArgs({
            pageIdx: data.pageIdx,
          }),
        },
        logger,
      );
    },
  },
});
