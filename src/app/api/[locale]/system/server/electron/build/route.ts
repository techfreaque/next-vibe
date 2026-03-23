/**
 * Electron Build Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import electronBuildDefinition from "./definition";
import { ElectronBuildRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: electronBuildDefinition,
  [Methods.POST]: {
    handler: ({ data, logger, t }) => {
      return ElectronBuildRepository.electronBuildRepository(data, logger, t);
    },
  },
});
