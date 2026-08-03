/**
 * Electron Build Route Handler
 */

import "server-only";

import { Methods } from "../../../../core/definition/enums";
import { endpointsHandler } from "../../../../core/route/multi";

import electronBuildDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: electronBuildDefinition,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import("./repository")
      ).ElectronBuildRepository.electronBuildRepository(data, logger, t),
  },
});
