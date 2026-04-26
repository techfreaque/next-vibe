/**
 * Desktop GetAccessibilityTree Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopAccessibilityRepository } from "../shared/repository";
import getAccessibilityTreeEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: getAccessibilityTreeEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopAccessibilityRepository.getAccessibilityTree(
        {
          appName: data.appName,
          maxDepth: data.maxDepth,
          includeActions: data.includeActions,
        },
        t,
        logger,
      ),
  },
});
