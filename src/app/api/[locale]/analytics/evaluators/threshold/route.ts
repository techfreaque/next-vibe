/**
 * Vibe Sense — Threshold Evaluator Route
 * Server-only.
 */

import "server-only";

import { success } from "next-vibe/shared/types/response.schema";

import { endpointsHandler } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/multi";
import { Methods } from "@/app/api/[locale]/system/unified-interface/shared/types/enums";

import definitions from "./definition";
import { ThresholdEvaluatorRepository } from "./repository";

export const { POST, tools } = endpointsHandler({
  endpoint: definitions,
  [Methods.POST]: {
    handler: ({ data }) => {
      const { source, op, value } = data;
      const signals = ThresholdEvaluatorRepository.computeThreshold(
        source,
        op,
        value,
      );
      return success({ signals });
    },
  },
});
