/**
 * Electron Build Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import electronBuildDefinition from "./definition";
import { electronBuildRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: electronBuildDefinition,
  [Methods.POST]: {
    handler: ({ data, logger, t }) => {
      return electronBuildRepository(data, logger, t);
    },
  },
});
