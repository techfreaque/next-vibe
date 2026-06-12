/**
 * Create AR Invoice Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
