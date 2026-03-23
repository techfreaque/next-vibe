/**
 * Payments Refund Volume - Route
 * Server-only.
 */

import "server-only";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { QueryPaymentsRefundVolumeRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) =>
      QueryPaymentsRefundVolumeRepository.queryPaymentsRefundVolume(data),
  },
});
