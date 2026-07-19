/**
 * Desktop TakeScreenshot Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import takeScreenshotEndpoints from "./definition";
import { DesktopScreenshotRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: takeScreenshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger, toolExecutionContext }) =>
      DesktopScreenshotRepository.takeScreenshot(
        {
          outputPath: data.outputPath,
          screen: data.screen,
          monitorName: data.monitorName,
          maxWidth: data.maxWidth,
        },
        t,
        logger,
        toolExecutionContext.threadId,
      ),
  },
});
