/**
 * IMAP Messages List API Route Handler
 * Handles GET requests for listing IMAP messages with filtering and pagination
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { imapMessagesRepository } from "../repository";
import definitions from "./definition";

/**
 * Export handlers using endpointHandler
 */
export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlVariables, user, locale, logger }) =>
      imapMessagesRepository.listMessages(urlVariables, user, locale, logger),
  },
});
