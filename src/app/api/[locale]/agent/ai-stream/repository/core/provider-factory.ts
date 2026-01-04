/**
 * ProviderFactory - Creates AI provider instances based on model
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ApiProvider, getModelById, type ModelId } from "../../../chat/model-access/models";
import { createFreedomGPT } from "../../providers/freedomgpt";
import { createGabAI } from "../../providers/gab-ai";
import { createUncensoredAI } from "../../providers/uncensored-ai";

export class ProviderFactory {
  /**
   * Get the appropriate provider for a given model
   */
  static getProviderForModel(
    model: ModelId,
    logger: EndpointLogger,
  ): ReturnType<
    | typeof createOpenRouter
    | typeof createUncensoredAI
    | typeof createFreedomGPT
    | typeof createGabAI
  > {
    const modelOption = getModelById(model);

    switch (modelOption.apiProvider) {
      case ApiProvider.UNCENSORED_AI:
        return createUncensoredAI({
          apiKey: agentEnv.UNCENSORED_AI_API_KEY,
          logger,
        });

      case ApiProvider.FREEDOMGPT:
        return createFreedomGPT();

      case ApiProvider.GAB_AI:
        return createGabAI();

      default:
        return createOpenRouter({
          apiKey: agentEnv.OPENROUTER_API_KEY,
        });
    }
  }
}
