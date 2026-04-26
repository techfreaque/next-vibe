/**
 * Desktop FocusWindow Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopWindowRepository } from "../shared/repository";
import focusWindowEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: focusWindowEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopWindowRepository.focusWindow(
        { windowId: data.windowId, pid: data.pid, title: data.title },
        t,
        logger,
      ),
  },
});
