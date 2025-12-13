/**
 * TakeScreenshot Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import takeScreenshotEndpoints from "./definition";
import {
  executeTakeScreenshot,
  filterUndefinedArgs,
} from "../shared/repository";

export const { POST, tools } = endpointsHandler({
  endpoint: takeScreenshotEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, logger }) => {
      return executeTakeScreenshot(
        {
          toolName: "take-screenshot",
          args: filterUndefinedArgs({
            uid: data.uid,
            fullPage: data.fullPage,
            format: data.format,
            quality: data.quality,
            filePath: data.filePath,
          }),
        },
        logger,
      );
    },
  },
});
