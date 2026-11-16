/**
 * Verify-Email Reminder Route Handler
 * Called hourly by cron; admins can trigger it (dryRun to preview)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { VerifyEmailReminderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      VerifyEmailReminderRepository.sendDueReminders(data, logger, t),
  },
});
