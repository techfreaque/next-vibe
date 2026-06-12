/**
 * Send Payment Reminder Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
