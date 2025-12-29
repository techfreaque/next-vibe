/**
 * Campaign Starter Configuration API Route Handler
 * Handles GET and PUT requests for campaign starter configuration
 */

import "server-only";

import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { CampaignStarterConfigRepository } from "./repository";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, PUT, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ user, logger }) => {
      const result = await CampaignStarterConfigRepository.getConfig(
        user,
        logger,
      );
      // Wrap the response data in the expected structure
      if (result.success && result.data) {
        return success({
          response: result.data,
        });
      }
      return fail({
        message: "app.api.leads.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    },
  },
  [Methods.PUT]: {
    email: undefined,
    handler: async ({ data, user, locale, logger }) => {
      const result = await CampaignStarterConfigRepository.updateConfig(
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
      return fail({
        message: "app.api.leads.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    },
  },
});
