/**
 * SelectPage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { executeSelectPage, filterUndefinedArgs } from "../shared/repository";
import selectPageEndpoints, { type SelectPageResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: selectPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger }) =>
      executeSelectPage<SelectPageResponseOutput>(
        {
          toolName: "select-page",
          args: filterUndefinedArgs({
            pageIdx: data.pageIdx,
          }),
        },
        logger,
      ),
  },
});
