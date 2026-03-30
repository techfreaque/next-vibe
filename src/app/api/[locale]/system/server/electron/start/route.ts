/**
 * Electron Start Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import electronStartDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: electronStartDefinition,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { ElectronStartRepository } = await import(
        /* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository"
      );
      return ElectronStartRepository.electronStartRepository(data, logger, t);
    },
  },
});
