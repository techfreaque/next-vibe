/**
 * OpenRouter Models Repository
 * Fetches model pricing and metadata from OpenRouter API and updates models.ts
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";

import { ModelId, type ModelOption, modelOptions } from "../models";
import type { OpenRouterModelsGetResponseOutput } from "./definition";

interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
}

interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/models";

export class OpenRouterModelsRepository {
  static async fetchModels(
    logger: EndpointLogger,
  ): Promise<ResponseType<OpenRouterModelsGetResponseOutput>> {
    try {
      logger.info("Fetching models from OpenRouter API", {
        url: OPENROUTER_API_URL,
      });

      const response = await fetch(OPENROUTER_API_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        logger.error("OpenRouter API request failed", {
          status: response.status,
          statusText: response.statusText,
        });

        return fail({
          message:
            "app.api.agent.models.openrouter.get.errors.server.title" as const,
          errorType: ErrorResponseTypes.EXTERNAL_SERVICE_ERROR,
          messageParams: {
            status: response.status,
            statusText: response.statusText,
          },
        });
      }

      const data = (await response.json()) as OpenRouterModelsResponse;

      logger.debug("Fetched OpenRouter models", {
        totalModels: data.data.length,
      });

      // Create a map for quick lookup
      const modelMap = new Map<string, OpenRouterModel>();
      for (const model of data.data) {
        modelMap.set(model.id, model);
      }

      // Extract pricing for our models by reading from modelOptions
      const models: Array<{
        id: string;
        name: string;
        contextLength: number;
        inputTokenCost: number;
        outputTokenCost: number;
      }> = [];

      const updates: Array<{
        modelId: ModelId;
        openRouterId: string;
        found: boolean;
        contextLength?: number;
        inputTokenCost?: number;
        outputTokenCost?: number;
      }> = [];

      for (const [modelId, modelConfig] of Object.entries(modelOptions) as [
        ModelId,
        ModelOption,
      ][]) {
        const openRouterId = modelConfig.openRouterModel;
        const model = modelMap.get(openRouterId);

        if (model) {
          // Convert from per-token to per-million-tokens
          const inputTokenCost = parseFloat(model.pricing.prompt) * 1_000_000;
          const outputTokenCost =
            parseFloat(model.pricing.completion) * 1_000_000;

          const roundedInput = Math.round(inputTokenCost * 100) / 100;
          const roundedOutput = Math.round(outputTokenCost * 100) / 100;

          models.push({
            id: modelId,
            name: model.name,
            contextLength: model.context_length,
            inputTokenCost: roundedInput,
            outputTokenCost: roundedOutput,
          });

          updates.push({
            modelId,
            openRouterId,
            found: true,
            contextLength: model.context_length,
            inputTokenCost: roundedInput,
            outputTokenCost: roundedOutput,
          });
        } else {
          updates.push({
            modelId,
            openRouterId,
            found: false,
          });
        }
      }

      // Update models.ts file
      const modelsPath = join(
        process.cwd(),
        "src/app/api/[locale]/agent/models/models.ts",
      );
      let content = readFileSync(modelsPath, "utf-8");

      let updatedCount = 0;
      for (const update of updates) {
        if (!update.found) {
          continue;
        }

        // update.modelId is the enum VALUE (e.g., "gpt-52-pro")
        // We need to find the enum NAME (e.g., "GPT_5_2_PRO")
        const enumEntry = Object.entries(ModelId).find(
          // oxlint-disable-next-line no-unused-vars
          ([_, value]) => value === update.modelId,
        );

        if (!enumEntry) {
          logger.debug("Could not find enum name for model ID", {
            modelId: update.modelId,
          });
          continue;
        }

        const enumKey = enumEntry[0];

        logger.debug("Updating model pricing", {
          modelId: update.modelId,
          enumKey,
          contextLength: update.contextLength,
          inputCost: update.inputTokenCost,
          outputCost: update.outputTokenCost,
        });

        // Update contextWindow
        const contextWindowRegex = new RegExp(
          `(\\[ModelId\\.${enumKey}\\]:\\s*\\{[^}]*?contextWindow:\\s*)\\d+`,
          "s",
        );
        if (contextWindowRegex.test(content)) {
          content = content.replace(
            contextWindowRegex,
            `$1${update.contextLength}`,
          );
          updatedCount++;
        } else {
          logger.debug("Could not find contextWindow pattern", {
            enumKey,
            pattern: `[ModelId.${enumKey}]`,
          });
        }

        // Update inputTokenCost
        const inputCostRegex = new RegExp(
          `(\\[ModelId\\.${enumKey}\\]:\\s*\\{[^}]*?inputTokenCost:\\s*)[\\d.]+`,
          "s",
        );
        if (inputCostRegex.test(content)) {
          content = content.replace(
            inputCostRegex,
            `$1${update.inputTokenCost}`,
          );
        }

        // Update outputTokenCost
        const outputCostRegex = new RegExp(
          `(\\[ModelId\\.${enumKey}\\]:\\s*\\{[^}]*?outputTokenCost:\\s*)[\\d.]+`,
          "s",
        );
        if (outputCostRegex.test(content)) {
          content = content.replace(
            outputCostRegex,
            `$1${update.outputTokenCost}`,
          );
        }
      }

      // Write updated content back to file
      writeFileSync(modelsPath, content, "utf-8");

      // Categorize models for reporting
      const notFoundOpenRouterModels = updates.filter(
        (u) =>
          !u.found && modelOptions[u.modelId]?.apiProvider === "openrouter",
      );
      const nonOpenRouterModels = updates.filter(
        (u) =>
          !u.found && modelOptions[u.modelId]?.apiProvider !== "openrouter",
      );

      logger.info("Model pricing update completed", {
        modelsFound: models.length,
        modelsTotal: Object.keys(modelOptions).length,
        updatedCount,
        missingOpenRouterCount: notFoundOpenRouterModels.length,
        nonOpenRouterCount: nonOpenRouterModels.length,
      });

      return success({
        summary: {
          totalModels: Object.keys(modelOptions).length,
          modelsFound: models.length,
          modelsUpdated: updatedCount,
          fileUpdated: updatedCount > 0,
        },
        models,
        missingOpenRouterModels: notFoundOpenRouterModels.map((m) => ({
          modelId: m.modelId,
          openRouterId: m.openRouterId,
          suggestion: "Consider marking as LEGACY or removing from models.ts",
        })),
        nonOpenRouterModels: nonOpenRouterModels.map((m) => ({
          modelId: m.modelId,
          provider:
            modelOptions[m.modelId as keyof typeof modelOptions]?.apiProvider ??
            "unknown",
        })),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch OpenRouter models", parsedError);

      return fail({
        message:
          "app.api.agent.models.openrouter.get.errors.unknown.title" as const,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}
