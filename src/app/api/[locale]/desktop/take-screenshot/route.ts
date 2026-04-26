/**
 * Desktop TakeScreenshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopScreenshotRepository } from "../shared/repository";
import takeScreenshotEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: takeScreenshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopScreenshotRepository.takeScreenshot(
        {
          outputPath: data.outputPath,
          screen: data.screen,
          monitorName: data.monitorName,
          maxWidth: data.maxWidth,
        },
        t,
        logger,
      ),
  },
});
