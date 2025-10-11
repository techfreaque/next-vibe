/**
 * Batch Operations API Route Handler
 * Handles PATCH requests for batch updating leads
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/types";

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
      return await batchRepository.batchUpdateLeads(data, user, locale, logger);
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
      return await batchRepository.batchDeleteLeads(data, user, locale, logger);
    },
  },
});
