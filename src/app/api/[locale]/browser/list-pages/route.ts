/**
 * ListPages Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import listPagesEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: listPagesEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeMCPTool(
        {
          toolName: BrowserTool.LIST_PAGES,
          args: BrowserSharedRepository.filterUndefinedArgs({}),
          instanceId: data.instanceId,
        },
        t,
        logger,
        platform,
        streamContext.threadId,
      ),
  },
});
