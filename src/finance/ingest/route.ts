/**
 * Finance Ingest - Route
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
    email: undefined,
    handler: ({ data, user, logger, t, locale }) =>
      FinanceRepository.ingest(data, user.id, logger, t, locale),
  },
});
