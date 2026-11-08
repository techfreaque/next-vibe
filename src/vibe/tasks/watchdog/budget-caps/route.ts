/**
 * Task Budget Caps - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { TaskWatchdogRepository } from "../repository";
import definitions from "./definition";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ t, logger }) => TaskWatchdogRepository.listCaps(t, logger),
  },
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      TaskWatchdogRepository.setCap(data, t, logger),
  },
});
