/**
 * Electron Build Route Handler
 */

import "server-only";

import { endpointsHandler } from "next-vibe/core/route/multi";
import { Methods } from "next-vibe/core/definition/enums";

import electronBuildDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: electronBuildDefinition,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      )).ElectronBuildRepository.electronBuildRepository(data, logger, t),
  },
});
