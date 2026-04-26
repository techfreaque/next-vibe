/**
 * Desktop GetFocusedWindow Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopWindowRepository } from "../shared/repository";
import getFocusedWindowEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: getFocusedWindowEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger }) =>
      DesktopWindowRepository.getFocusedWindow(t, logger),
  },
});
