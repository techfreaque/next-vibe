/**
 * Batch Operations API Route Handler
 * Handles PATCH requests for batch updating leads
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import {
  renderBatchDeleteNotificationMail,
  renderBatchUpdateNotificationMail,
} from "./email";
import { BatchRepository } from "./repository";

export const { PATCH, DELETE, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.PATCH]: {
    email: [
      {
        render: renderBatchUpdateNotificationMail,
        ignoreErrors: true,
      },
    ],
    handler: ({ data, logger }) =>
      BatchRepository.batchUpdateLeads(data, logger),
  },
  [Methods.DELETE]: {
    email: [
      {
        render: renderBatchDeleteNotificationMail,
        ignoreErrors: true,
      },
    ],
    handler: ({ data, logger }) =>
      BatchRepository.batchDeleteLeads(data, logger),
  },
});
