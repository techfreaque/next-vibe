/**
 * Run TypeScript type checking Route
 * API route for run typescript type checking
 */

import "server-only";

import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { endpointsHandler } from "../../unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
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
