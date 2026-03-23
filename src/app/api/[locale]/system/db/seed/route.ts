/**
 * Run database seeds Route
 * API route for run database seeds
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import seedEndpoints from "./definition";
import { SeedRepository } from "./repository";

export const { tools } = endpointsHandler({
  endpoint: seedEndpoints,
  [Methods.POST]: {
    handler: ({ data, t, logger }) => {
      return SeedRepository.execute(data, t, logger);
    },
  },
});
