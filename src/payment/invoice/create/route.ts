/**
 * Create AR Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceCreateDefinitions from "./definition";
import { InvoiceCreateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceCreateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      InvoiceCreateRepository.createInvoice(user.id, data, logger, locale),
  },
});
