/**
 * Business Info API Route Handlers
 * Next.js API route handlers with validation and business logic delegation
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

import definitions from "./definition";
import { businessInfoRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: async ({ user, locale, logger }) => {
      return await businessInfoRepository.getBusinessInfo(
        user.id,
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.POST]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      return await businessInfoRepository.updateBusinessInfo(
        user.id,
        data,
        user,
        locale,
        logger,
      );
    },
  },
});
