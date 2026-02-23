/**
 * Customer Portal API Route
 * Handles Stripe customer portal session creation
 */

import "server-only";

import { scopedTranslation as paymentScopedTranslation } from "@/app/api/[locale]/payment/i18n";
import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { PaymentRepository } from "../repository";
import portalDefinitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: portalDefinitions,
  [Methods.POST]: {
    email: undefined,
    handler: ({ data, user, locale, logger }) => {
      const { t } = paymentScopedTranslation.scopedT(locale);
      return PaymentRepository.createCustomerPortal(
        user.id,
        data,
        locale,
        t,
        logger,
      );
    },
  },
});
