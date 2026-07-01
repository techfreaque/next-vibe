/**
 * TakeScreenshot Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
