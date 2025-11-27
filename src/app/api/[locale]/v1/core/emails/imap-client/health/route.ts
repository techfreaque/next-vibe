/**
 * IMAP Health Monitoring API Route Handler
 * Handles GET requests for IMAP server health monitoring
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { imapHealthRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      imapHealthRepository.getHealthStatus(data, user, locale, logger),
  },
});
