/**
 * Setup Update Route
 * API route for CLI update (uninstall + reinstall)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import updateEndpoints from "./definition";
import { SetupUpdateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: updateEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, t }) =>
      SetupUpdateRepository.updateCli(data, user, t),
  },
});
