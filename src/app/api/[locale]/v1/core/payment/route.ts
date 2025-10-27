/**
 * Payment API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/create-handlers";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-backend/shared/enums";

import endpoints from "./definition";
import { paymentRepository as repository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, locale, logger }) =>
      repository.createPaymentSession(data, user, locale, logger),
  },
  [Methods.GET]: {
    handler: ({ data, user, locale, logger }) =>
      repository.getPaymentInfo(data, user, locale, logger),
  },
});
