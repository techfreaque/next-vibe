/**
 * SelectPage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeSelectPage, filterUndefinedArgs } from "../shared/repository";
import selectPageEndpoints, {
  type SelectPageResponseOutput,
} from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: selectPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeSelectPage<SelectPageResponseOutput>(
        {
          toolName: BrowserTool.SELECT_PAGE,
          args: filterUndefinedArgs({
            pageId: data.pageId,
            bringToFront: data.bringToFront,
          }),
        },
        t,
        logger,
      ),
  },
});
