/**
 * Run TypeScript type checking Route
 * API route for run typescript type checking
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger }) => {
      const typecheckRepository = (await import("./repository")).typecheckRepository;
      return await typecheckRepository.execute(data, logger);
    },
  },
});
