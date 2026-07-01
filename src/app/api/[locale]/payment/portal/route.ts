/**
 * Customer Portal API Route
 * Handles Stripe customer portal session creation
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { PaymentRepository } from "../repository";
import portalDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: portalDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      PaymentRepository.createCustomerPortal(user.id, data, locale, logger),
  },
});
