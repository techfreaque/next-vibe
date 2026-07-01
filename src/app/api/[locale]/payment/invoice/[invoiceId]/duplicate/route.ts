/**
 * Duplicate Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

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
