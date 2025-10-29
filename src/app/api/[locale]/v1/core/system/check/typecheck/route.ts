/**
 * Run TypeScript type checking Route
 * API route for run typescript type checking
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import endpoints from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: async ({ data, logger }) => {
      const typecheckRepository = (await import("./repository"))
        .typecheckRepository;
      return await typecheckRepository.execute(data, logger);
    },
  },
});
