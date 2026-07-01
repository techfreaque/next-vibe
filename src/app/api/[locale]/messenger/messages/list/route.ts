/**
 * Emails List API Route Handler
 * Handles GET requests for listing emails with filtering and pagination
 */

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { EmailsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      EmailsRepository.getEmails(data, user, logger, locale),
  },
});
