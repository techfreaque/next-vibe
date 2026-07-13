/**
 * Payment API Route Handlers
 * Next.js API route handlers with validation and notifications
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import endpoints from "./definition";
import { PaymentRepository } from "./repository";

export const { GET, POST, tools } = endpointsHandler({
  endpoint: endpoints,
  [Methods.POST]: {
    handler: ({ data, user, t, logger, locale }) =>
      PaymentRepository.createPaymentSession(data, user, t, logger, locale),
  },
  [Methods.GET]: {
    handler: ({ data, user, t, logger }) =>
      PaymentRepository.getPaymentInfo(data, user, t, logger),
  },
});
