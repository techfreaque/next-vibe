/**
 * Payment Dashboard Route
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import paymentDashboardDefinitions from "./definition";
import { PaymentDashboardRepository } from "./repository";

export const { GET, tools } = endpointsHandler({
  endpoint: paymentDashboardDefinitions,
  [Methods.GET]: {
    email: undefined,
    handler: ({ data, user, logger, locale }) =>
      PaymentDashboardRepository.getDashboard(user.id, data, logger, locale),
  },
});
