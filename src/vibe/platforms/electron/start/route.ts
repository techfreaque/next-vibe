/**
 * Electron Start Route Handler
 */

import "server-only";

import { Methods } from "../../../core/definition/enums";
import { endpointsHandler } from "../../../core/route/multi";
import electronStartDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: electronStartDefinition,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) =>
      (
        await import("./repository")
      ).ElectronStartRepository.electronStartRepository(data, logger, t),
  },
});
