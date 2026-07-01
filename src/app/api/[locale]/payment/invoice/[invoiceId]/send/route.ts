/**
 * Send Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
