/**
 * Finance Thresholds - Route
 * Server-only.
 */

import "server-only";

import { Methods } from "next-vibe/core/definition/enums";
import { endpointsHandler } from "next-vibe/core/route/multi";

import { FinanceRepository } from "../repository";
import definitions from "./definition";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data, t, logger }) =>
      FinanceRepository.setThreshold(data, t, logger),
  },
});
