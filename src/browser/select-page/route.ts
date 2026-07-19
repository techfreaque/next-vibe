/**
 * SelectPage Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import selectPageEndpoints, {
  type SelectPageResponseOutput,
} from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: selectPageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, toolExecutionContext }) =>
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
        toolExecutionContext.threadId,
      ),
  },
});
