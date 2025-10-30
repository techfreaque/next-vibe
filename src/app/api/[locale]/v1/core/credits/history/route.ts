/**
 * Credit History API Route Handler
 * /api/v1/core/agent/chat/credits/history
 */

import { endpointsHandler } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/server-only/handler/multi";
import { Methods } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/types/enums";

import { creditRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: async ({ data, user }) =>
      await creditRepository.getTransactions(user.id, data.limit, data.offset),
  },
});
