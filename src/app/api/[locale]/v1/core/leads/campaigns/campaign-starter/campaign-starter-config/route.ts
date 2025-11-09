/**
 * Campaign Starter Configuration API Route Handler
 * Handles GET and PUT requests for campaign starter configuration
 */

import "server-only";

import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { campaignStarterConfigRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ data, user, locale, logger }) => {
      const result = await campaignStarterConfigRepository.getConfig(
        data,
        user,
        locale,
        logger,
      );
      // Wrap the response data in the expected structure
      if (result.success && result.data) {
        return success({
          response: result.data,
        });
      }
      return createErrorResponse(
        "app.api.v1.core.leads.error.general.internal_server_error",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      const result = await campaignStarterConfigRepository.updateConfig(
        data,
        user,
        locale,
        logger,
      );
      // Wrap the response data in the expected structure
      if (result.success && result.data) {
        return success({
          response: result.data,
        });
      }
      return createErrorResponse(
        "app.api.v1.core.leads.error.general.internal_server_error",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    },
  },
});
