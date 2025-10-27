/**
 * Customer Portal API Route
 * Handles Stripe customer portal session creation
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";
import { authRepository } from "@/app/api/[locale]/v1/core/user/auth/repository";

import { paymentRepository } from "../repository";
import portalDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: portalDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) =>
      paymentRepository.createCustomerPortal(
        authRepository.requireUserId(user),
        data,
        locale,
        logger,
      ),
  },
});
