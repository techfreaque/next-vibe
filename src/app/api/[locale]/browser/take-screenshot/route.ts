/**
 * TakeScreenshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import takeScreenshotEndpoints from "./definition";
import { BrowserSharedRepository, BrowserTool } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: takeScreenshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, platform, streamContext }) =>
      BrowserSharedRepository.executeTakeScreenshot(
        {
          toolName: BrowserTool.TAKE_SCREENSHOT,
          args: BrowserSharedRepository.filterUndefinedArgs({
            uid: data.uid,
            fullPage: data.fullPage,
            format: data.format,
            quality: data.quality,
            filePath: data.filePath,
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
