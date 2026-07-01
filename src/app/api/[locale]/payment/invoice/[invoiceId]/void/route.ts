/**
 * Void Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceVoidDefinitions from "./definition";
import { InvoiceVoidRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceVoidDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceVoidRepository.voidInvoice(user.id, urlPathParams, logger, locale),
  },
});
