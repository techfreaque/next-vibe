/**
 * Send Payment Reminder Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceSendReminderDefinitions from "./definition";
import { InvoiceSendReminderRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceSendReminderDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      InvoiceSendReminderRepository.sendReminder(
        user.id,
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
