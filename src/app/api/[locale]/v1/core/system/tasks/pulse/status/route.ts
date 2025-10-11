/**
 * Pulse Status API Route Handler
 * Migrated from side-tasks-old/cron/pulse/route.ts
 * Handles GET requests for pulse health status
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/endpoints-handler";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";

import { pulseStatusEndpoint } from "../definition";
import { pulseHealthRepository } from "../repository";

// Create endpoints object with just GET
const endpoints = { GET: pulseStatusEndpoint };

export const { GET, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.GET]: {
    handler: ({ user, locale, logger }) =>
      pulseHealthRepository.getPulseStatus(user, locale, logger),
  },
});
