/**
 * System Health Check Route Handler
 * Called by cron every minute. Checks DB, memory, and disk.
 * Logs only when thresholds are breached - silent when healthy.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { DbHealthRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t }) => DbHealthRepository.check(t),
  },
});
