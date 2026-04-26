/**
 * Desktop ListWindows Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopWindowRepository } from "../shared/repository";
import listWindowsEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: listWindowsEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t, logger }) => DesktopWindowRepository.listWindows(t, logger),
  },
});
