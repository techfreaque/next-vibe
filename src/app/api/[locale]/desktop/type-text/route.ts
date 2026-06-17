/**
 * Desktop TypeText Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import typeTextEndpoints from "./definition";
import { DesktopInputRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: typeTextEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.typeText(
        {
          text: data.text,
          delay: data.delay,
          windowId: data.windowId,
          windowTitle: data.windowTitle,
        },
        t,
        logger,
      ),
  },
});
