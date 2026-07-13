/**
 * Get Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceGetDefinitions from "./definition";
import { InvoiceGetRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: invoiceGetDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceGetRepository.getInvoice(user.id, urlPathParams, logger, locale),
  },
});
