/**
 * Setup Uninstall Route
 * API route for CLI global uninstallation
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import uninstallEndpoints from "./definition";
import { SetupUninstallRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: uninstallEndpoints,
  [Methods.POST]: {
    handler: ({ data, user, t }) =>
      SetupUninstallRepository.uninstallCli(data, user, t),
  },
});
