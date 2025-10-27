/**
 * Email Stats API Route Handler
 * Handles GET requests for email statistics
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import definitions from "./definition";
import { emailStatsRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    email: undefined, // No emails for GET requests
    handler: ({ data, user, locale, logger }) =>
      emailStatsRepository.getStats(data, user, locale, logger),
  },
});
