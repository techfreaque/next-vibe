/**
 * ResizePage Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { BrowserTool, BrowserSharedRepository } from "./repository";

import resizePageEndpoints, {
  type ResizePageResponseOutput,
} from "./definition";

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
