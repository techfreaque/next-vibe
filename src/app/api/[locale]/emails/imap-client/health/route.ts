/**
 * IMAP Health Monitoring API Route Handler
 * Handles GET requests for IMAP server health monitoring
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { imapHealthRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ user, logger }) =>
      imapHealthRepository.getHealthStatus(user, logger),
  },
});
