/**
 * ClosePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { BrowserTool } from "../enum";
import { BrowserSharedRepository } from "../shared/repository";
import closePageEndpoints, { type ClosePageResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: closePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, user, request }) =>
      BrowserSharedRepository.executeClosePage<ClosePageResponseOutput>(
        {
          sessionId: request?.headers.get("authorization") ?? user.id ?? user.leadId,
          toolName: BrowserTool.CLOSE_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageId: data.pageId,
          }),
        },
        t,
        logger,
      ),
  },
});
