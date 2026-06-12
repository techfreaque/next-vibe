/**
 * SelectPage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { BrowserTool, BrowserSharedRepository } from "./repository";

import selectPageEndpoints, {
  type SelectPageResponseOutput,
} from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: selectPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeSelectPage<SelectPageResponseOutput>(
        {
          toolName: BrowserTool.SELECT_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            pageId: data.pageId,
            bringToFront: data.bringToFront,
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
