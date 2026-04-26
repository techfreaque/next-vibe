/**
 * Desktop MoveMouse Tool - Route Handler
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { DesktopInputRepository } from "../shared/repository";
import moveMouseEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: moveMouseEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.moveMouse({ x: data.x, y: data.y }, t, logger),
  },
});
