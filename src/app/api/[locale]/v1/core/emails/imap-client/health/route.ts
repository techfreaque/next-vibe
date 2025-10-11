/**
 * IMAP Health Monitoring API Route Handler
 * Handles GET requests for IMAP server health monitoring
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import definitions from "./definition";
import { imapHealthRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      imapHealthRepository.getHealthStatus(data, user, locale, logger),
  },
});
