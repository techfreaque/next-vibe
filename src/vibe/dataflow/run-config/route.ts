/**
 * Vibe Sense - Run Config Route
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import definitions from "./definition";
import { RunConfigRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      RunConfigRepository.execute(data, logger, t),
  },
});
