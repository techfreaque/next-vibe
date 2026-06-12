/**
 * Duplicate Invoice Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import invoiceDuplicateDefinitions from "./definition";
import { InvoiceDuplicateRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceDuplicateDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceDuplicateRepository.duplicateInvoice(
        user.id,
        urlPathParams,
        logger,
        locale,
      ),
  },
});
