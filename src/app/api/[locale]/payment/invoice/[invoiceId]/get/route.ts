/**
 * Get Invoice Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
