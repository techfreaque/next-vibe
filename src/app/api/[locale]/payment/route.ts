/**
 * Payment API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import endpoints from "./definition";
import { PaymentRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      PaymentRepository.createPaymentSession(data, user, locale, logger),
  },
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      PaymentRepository.getPaymentInfo(data, user, locale, logger),
  },
});
