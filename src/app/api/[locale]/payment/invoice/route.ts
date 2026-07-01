/**
 * Payment Invoice API Route
 * Handles invoice creation and management
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { PaymentRepository } from "../repository";
import invoiceDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: invoiceDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      PaymentRepository.createInvoice(user.id, data, locale, logger),
  },
});
