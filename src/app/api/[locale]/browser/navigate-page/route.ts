/**
 * NavigatePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { executeMCPTool, filterUndefinedArgs } from "../shared/repository";
import navigatePageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: navigatePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      executeMCPTool(
        {
          toolName: BrowserTool.NAVIGATE_PAGE,
          args: filterUndefinedArgs({
            type: data.type,
            url: data.url,
            ignoreCache: data.ignoreCache,
            handleBeforeUnload: data.handleBeforeUnload,
            initScript: data.initScript,
            timeout: data.timeout,
          }),
        },
        t,
        logger,
      ),
  },
});
