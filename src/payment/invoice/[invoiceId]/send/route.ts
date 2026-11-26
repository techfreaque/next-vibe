/**
 * Send Invoice Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import invoiceSendDefinitions from "./definition";
import { InvoiceSendRepository } from "./repository";

export const { GET, POST, PATCH, tools } = endpointsHandler({
  endpoint: invoiceSendDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceSendRepository.shareInvoice(
        urlPathParams.invoiceId,
        user.id,
        locale,
        logger,
      ),
  },
  [Methods.PATCH]: {
    email: undefined,
    handler: ({ data, urlPathParams, user, logger, locale }) =>
      InvoiceSendRepository.emailInvoice(
        urlPathParams.invoiceId,
        data.expectedRecipient,
        user.id,
        locale,
        logger,
      ),
  },
  [Methods.POST]: {
    email: undefined,
    handler: ({ urlPathParams, user, logger, locale }) =>
      InvoiceSendRepository.sendInvoice(user.id, urlPathParams, logger, locale),
  },
});
