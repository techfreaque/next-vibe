import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import vibeDepsEndpoints from "./definition";
import { VibeDepsRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: vibeDepsEndpoints,
  [Methods.POST]: {
    handler: ({ data, logger, t }) =>
      VibeDepsRepository.execute(data, logger, t),
  },
});
