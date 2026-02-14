import { createWriteStream, existsSync, mkdirSync } from "node:fs";

import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import type { JSONValue } from "ai";

import { agentEnv } from "@/app/api/[locale]/agent/env";
import {
  ApiProvider,
  type ModelOption,
} from "@/app/api/[locale]/agent/models/models";
import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { createFreedomGPT } from "../../providers/freedomgpt";
import { createGabAI } from "../../providers/gab-ai";
import { createUncensoredAI } from "../../providers/uncensored-ai";

export class ProviderFactory {
  static getProviderForModel(
    modelOption: ModelOption,
    logger: EndpointLogger,
  ): ReturnType<
    | typeof createOpenRouter
    | typeof createUncensoredAI
    | typeof createFreedomGPT
    | typeof createGabAI
  > {
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
