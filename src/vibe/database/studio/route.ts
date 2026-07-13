/**
 * Open database studio Route
 * API route for open database studio
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import studioEndpoints from "./definition";
import { StudioRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: studioEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) => StudioRepository.execute(data, t, logger),
  },
});
