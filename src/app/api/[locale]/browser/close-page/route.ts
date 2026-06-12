/**
 * ClosePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { BrowserTool, BrowserSharedRepository } from "./repository";

import closePageEndpoints, { type ClosePageResponseOutput } from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: closePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeClosePage<ClosePageResponseOutput>(
        {
          toolName: BrowserTool.CLOSE_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageId: data.pageId,
          }),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
