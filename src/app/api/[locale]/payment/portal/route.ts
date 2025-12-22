/**
 * Customer Portal API Route
 * Handles Stripe customer portal session creation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
