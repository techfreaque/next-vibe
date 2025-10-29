/**
 * IMAP Messages List API Route Handler
 * Handles GET requests for listing IMAP messages with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointsHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlPathParams, user, locale, logger }) =>
      imapMessagesRepository.listMessages(urlPathParams, user, locale, logger),
  },
});
