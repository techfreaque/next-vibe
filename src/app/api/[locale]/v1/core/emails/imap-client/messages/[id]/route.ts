/**
 * IMAP Message Detail API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

export const { GET, PATCH, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: async ({ urlPathParams, user, locale, logger }) => {
      return await imapMessagesRepository.getMessageByIdFormatted(
        { id: urlPathParams.id },
        user,
        locale,
        logger,
      );
    },
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: async ({ urlPathParams, data, user, locale, logger }) => {
      return await imapMessagesRepository.updateMessageFormatted(
        { messageId: urlPathParams.id, updates: data },
        user,
        locale,
        logger,
      );
    },
  },
});
