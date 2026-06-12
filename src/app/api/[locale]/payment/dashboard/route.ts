/**
 * Payment Dashboard Route
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

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
