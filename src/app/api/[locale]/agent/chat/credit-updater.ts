"use client";

import {
  DEFAULT_INPUT_TOKENS,
  DEFAULT_OUTPUT_TOKENS,
} from "@/app/api/[locale]/agent/models/constants";
import type { ModelId } from "@/app/api/[locale]/agent/models/models";
import {
  getCreditCostFromModel,
  getModelById,
} from "@/app/api/[locale]/agent/models/models";

export function createCreditUpdateCallback(
  modelId: ModelId,
  deductCredits: (creditCost: number, feature: string) => void,
): () => void {
  const modelConfig = getModelById(modelId);
  const creditCost = getCreditCostFromModel(
    modelConfig,
    DEFAULT_INPUT_TOKENS,
    DEFAULT_OUTPUT_TOKENS,
  );

  return () => {
    if (creditCost > 0) {
      deductCredits(creditCost, `chat_message_${modelId}`);
    }
  };
}
