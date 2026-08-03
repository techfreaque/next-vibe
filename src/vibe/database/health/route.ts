/**
 * System Health Check Route Handler
 * Called by cron every minute. Checks DB, memory, and disk.
 * Logs only when thresholds are breached - silent when healthy.
 */

import "server-only";

import { Methods } from "../../core/definition/enums";
import { endpointsHandler } from "../../core/route/multi";

import definitions from "./definition";
import { DbHealthRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ t }) => DbHealthRepository.check(t),
  },
});
