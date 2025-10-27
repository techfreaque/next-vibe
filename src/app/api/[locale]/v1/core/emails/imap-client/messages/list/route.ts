/**
 * IMAP Messages List API Route Handler
 * Handles GET requests for listing IMAP messages with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlPathParams, user, locale, logger }) =>
      imapMessagesRepository.listMessages(urlPathParams, user, locale, logger),
  },
});
