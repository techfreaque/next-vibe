/**
 * Invoice List Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
