/**
 * Desktop MoveMouse Tool - Route Handler
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import moveMouseEndpoints from "./definition";
import { DesktopInputRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: moveMouseEndpoints,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, t, logger }) =>
      DesktopInputRepository.moveMouse({ x: data.x, y: data.y }, t, logger),
  },
});
