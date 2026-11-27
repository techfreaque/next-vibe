/**
 * Invoice E-Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceEInvoiceDefinitions from "./definition";
import { InvoiceEInvoiceRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: invoiceEInvoiceDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, user, logger, locale }) =>
      InvoiceEInvoiceRepository.getEInvoice(
        user.id,
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
