/**
 * ProviderFactory - Creates AI provider instances based on model
 */

import { createOpenRouter } from "@openrouter/ai-sdk-provider";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import {
  ApiProvider,
  getModelById,
  type ModelId,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

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
        return createUncensoredAI(logger);

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
