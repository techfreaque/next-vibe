/**
 * Batch Operations API Route Handler
 * Handles PATCH requests for batch updating leads
 */

import {
  fail,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import {
  renderBatchDeleteNotificationMail,
  renderBatchUpdateNotificationMail,
} from "./email";
import { batchRepository } from "./repository";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: [
      {
        render: renderBatchUpdateNotificationMail,
        ignoreErrors: true, // Don't fail batch operation if notification email fails
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      const result = await batchRepository.batchUpdateLeads(
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
        message: "app.api.v1.core.leads.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    },
  },
  [Methods.DELETE]: {
    email: [
      {
        render: renderBatchDeleteNotificationMail,
        ignoreErrors: true, // Don't fail batch operation if notification email fails
      },
    ],
    handler: async ({ data, user, locale, logger }) => {
      const result = await batchRepository.batchDeleteLeads(
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
        message: "app.api.v1.core.leads.error.general.internal_server_error",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    },
  },
});
