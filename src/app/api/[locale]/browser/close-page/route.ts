/**
 * ClosePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeClosePage, filterUndefinedArgs } from "../shared/repository";
import closePageEndpoints, { type ClosePageResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: closePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeClosePage<ClosePageResponseOutput>(
        {
          toolName: BrowserTool.CLOSE_PAGE,
          args: filterUndefinedArgs({
            pageId: data.pageId,
          }),
        },
        t,
        logger,
      ),
  },
});
