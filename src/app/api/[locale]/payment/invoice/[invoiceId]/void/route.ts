/**
 * Void Invoice Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
