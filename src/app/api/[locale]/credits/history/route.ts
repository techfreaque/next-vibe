/**
 * Credit History API Route Handler
 * /api/agent/chat/credits/history
 */

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import { CreditRepository } from "../repository";
import definitions from "./definition";

export const { GET, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.GET]: {
    handler: ({ data, user, logger }) =>
      CreditRepository.getTransactionHistory(data, user, logger),
  },
});
