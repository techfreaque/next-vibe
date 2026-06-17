/**
 * NewPage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import newPageEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: newPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.NEW_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            url: data.url,
            background: data.background,
            isolatedContext: data.isolatedContext,
            timeout: data.timeout,
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
