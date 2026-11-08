/**
 * Export My Data Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { ExportMyDataRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ user, logger, t }) =>
      ExportMyDataRepository.exportMyData(user, logger, t),
  },
});
