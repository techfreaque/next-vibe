/**
 * Interactive Capture Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { InteractiveRepository } from "../repository";
import captureEndpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: captureEndpoints,
  [Methods.POST]: {
    handler: ({ data, t }) =>
      InteractiveRepository.capture(t, data.pid ?? null),
  },
});
