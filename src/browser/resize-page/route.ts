/**
 * ResizePage Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import resizePageEndpoints, {
  type ResizePageResponseOutput,
} from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: resizePageEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeResizePage<ResizePageResponseOutput>(
        {
          toolName: BrowserTool.RESIZE_PAGE,
          args: BrowserSharedRepository.filterUndefinedArgs({
            width: data.width,
            height: data.height,
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
