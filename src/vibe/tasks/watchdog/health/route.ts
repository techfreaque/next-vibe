/**
 * Task Health - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { TaskWatchdogRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ locale, t, logger }) =>
      TaskWatchdogRepository.health(locale, t, logger),
  },
});
