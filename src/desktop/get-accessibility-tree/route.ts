/**
 * Desktop GetAccessibilityTree Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import getAccessibilityTreeEndpoints from "./definition";
import { DesktopAccessibilityRepository } from "./repository";

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
