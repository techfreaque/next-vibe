/**
 * Electron Build Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import electronBuildDefinition from "./definition";

export const { tools } = endpointsHandler({
  endpoint: electronBuildDefinition,
  [Methods.POST]: {
    handler: async ({ data, logger, t }) => {
      const { ElectronBuildRepository } = await import(/* turbopackIgnore: true */ /* webpackIgnore: true */ "./repository");
      return ElectronBuildRepository.electronBuildRepository(data, logger, t);
    },
  },
});
