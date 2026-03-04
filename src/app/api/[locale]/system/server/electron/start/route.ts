/**
 * Electron Start Route Handler
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import electronStartDefinition from "./definition";
import { electronStartRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: electronStartDefinition,
  [Methods.POST]: {
    handler: ({ data, logger, t }) => {
      return electronStartRepository(data, logger, t);
    },
  },
});
