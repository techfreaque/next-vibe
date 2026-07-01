/**
 * Public Invoice View Route
 * Unauthenticated endpoint — validates HMAC token instead of session
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoicePublicViewDefinitions from "./definition";
import { InvoicePublicViewRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: invoicePublicViewDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, data, logger, locale }) =>
      InvoicePublicViewRepository.getPublicInvoice(
        urlPathParams,
        data,
        logger,
        locale,
      ),
  },
});
