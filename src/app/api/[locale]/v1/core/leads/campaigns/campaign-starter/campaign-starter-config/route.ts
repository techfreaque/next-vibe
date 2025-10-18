/**
 * Campaign Starter Configuration API Route Handler
 * Handles GET and PUT requests for campaign starter configuration
 */

import "server-only";

import {
  createErrorResponse,
  createSuccessResponse,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { campaignStarterConfigRepository } from "./repository";

/**
 * Export handlers using endpointHandler
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
        return createSuccessResponse({
          response: result.data,
        });
      }
      return createErrorResponse(
        "error.general.internal_server_error",
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
        return createSuccessResponse({
          response: result.data,
        });
      }
      return createErrorResponse(
        "error.general.internal_server_error",
        ErrorResponseTypes.INTERNAL_ERROR,
      );
    },
  },
});
