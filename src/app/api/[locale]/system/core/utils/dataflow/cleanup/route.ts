/**
 * Vibe Sense - Cleanup Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { VibeSenseRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ logger, locale }) =>
      VibeSenseRepository.runCleanup(logger, locale),
  },
});
