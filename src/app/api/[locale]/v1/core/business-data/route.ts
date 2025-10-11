/**
 * Business Data API Route Handlers
 * Next.js API route handlers with validation and business logic delegation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { businessDataRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ user, locale, logger }) => {
      return await businessDataRepository.getAllBusinessData(
        user.id,
        user,
        locale,
        logger,
      );
    },
  },
});
