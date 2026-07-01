/**
 * Electron Start Route Handler
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import electronStartDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: electronStartDefinition,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import(
          /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
        )
      ).ElectronStartRepository.electronStartRepository(data, logger, t),
  },
});
