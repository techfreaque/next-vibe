/**
 * Vibe Sense - OR Evaluator Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { OrEvaluatorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) => {
      const { signals } = data;
      const result = OrEvaluatorRepository.computeOr(signals);
      return success({ result });
    },
  },
});
