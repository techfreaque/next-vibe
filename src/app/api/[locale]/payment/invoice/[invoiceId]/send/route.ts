/**
 * Send Invoice Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import invoiceSendDefinitions from "./definition";
import { InvoiceSendRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceSendDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceSendRepository.sendInvoice(user.id, urlPathParams, logger, locale),
  },
});
