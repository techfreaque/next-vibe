/**
 * ClosePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import closePageEndpoints, { type ClosePageResponseOutput } from "./definition";
import { executeClosePage, filterUndefinedArgs } from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: closePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return executeClosePage<ClosePageResponseOutput>(
        {
          toolName: "close-page",
          args: filterUndefinedArgs({
            pageIdx: data.pageIdx,
          }),
        },
        user,
        logger,
        locale,
      );
    },
  },
});
