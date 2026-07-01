/**
 * Email by ID API Route Handler
 * Handles GET requests for individual emails
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { EmailsRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ urlPathParams, user, logger, locale }) =>
      EmailsRepository.getEmailById(urlPathParams, user, logger, locale),
  },
});
