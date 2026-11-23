/**
 * Signup Reminder Route Handler
 * Called every 30 minutes by cron; admins can trigger it (dryRun to preview)
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import definitions from "./definition";
import { SignupReminderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, logger, t }) =>
      SignupReminderRepository.sendDueReminders(data, logger, t),
  },
});
