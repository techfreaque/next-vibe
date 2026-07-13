/**
 * Invoice List Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceListDefinitions from "./definition";
import { InvoiceListRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: invoiceListDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      InvoiceListRepository.listInvoices(user.id, data, logger, locale),
  },
});
