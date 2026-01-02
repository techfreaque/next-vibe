/**
 * IMAP Message Detail API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ urlPathParams, logger }) => {
      return await imapMessagesRepository.getMessageByIdFormatted({ id: urlPathParams.id }, logger);
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlPathParams, data, logger }) => {
      return await imapMessagesRepository.updateMessageFormatted(
        { messageId: urlPathParams.id, updates: data },
        logger,
      );
    },
  },
});
