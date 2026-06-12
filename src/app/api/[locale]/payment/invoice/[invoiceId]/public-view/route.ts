/**
 * Public Invoice View Route
 * Unauthenticated endpoint — validates HMAC token instead of session
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
