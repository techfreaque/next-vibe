/**
 * NavigatePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import navigatePageEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: navigatePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.NAVIGATE_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
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
