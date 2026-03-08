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

import { ApiProvider, modelDefinitions, ModelId } from "../models";
import type { OpenRouterModelsGetResponseOutput } from "./definition";
import type { scopedTranslation } from "./i18n";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

interface OpenRouterModel {
  id: string;
  name: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
    input_cache_write?: string;
  };
}

interface OpenRouterModelsResponse {
  data: OpenRouterModel[];
}

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/models";

export class OpenRouterModelsRepository {
  static async fetchModels(
    logger: EndpointLogger,
    t: ModuleT,
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
          message: t("get.errors.server.title"),
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

      // Extract pricing for our models by iterating modelDefinitions
      // Only check OpenRouter providers (other providers like Claude Code have their own pricing)
      const models: Array<{
        id: string;
        name: string;
        contextLength: number;
        inputTokenCost: number;
        outputTokenCost: number;
        cacheReadTokenCost?: number;
        cacheWriteTokenCost?: number;
      }> = [];

      const updates: Array<{
        modelId: ModelId;
        openRouterId: string;
        found: boolean;
        contextLength?: number;
        inputTokenCost?: number;
        outputTokenCost?: number;
        cacheReadTokenCost?: number;
        cacheWriteTokenCost?: number;
      }> = [];

      const nonOpenRouterProviders: Array<{
        modelId: ModelId;
        provider: string;
      }> = [];

      for (const def of Object.values(modelDefinitions)) {
        for (const providerConfig of def.providers) {
          // Skip non-OpenRouter providers (they don't exist on OpenRouter)
          if (providerConfig.apiProvider !== ApiProvider.OPENROUTER) {
            nonOpenRouterProviders.push({
              modelId: providerConfig.id,
              provider: providerConfig.apiProvider,
            });
            continue;
          }

          const openRouterId = providerConfig.providerModel;
          const model = modelMap.get(openRouterId);

          if (model) {
            // Convert from per-token to per-million-tokens
            const inputTokenCost = parseFloat(model.pricing.prompt) * 1_000_000;
            const outputTokenCost =
              parseFloat(model.pricing.completion) * 1_000_000;

            const roundedInput = Math.round(inputTokenCost * 100) / 100;
            const roundedOutput = Math.round(outputTokenCost * 100) / 100;

            const cacheReadTokenCost = model.pricing.input_cache_read
              ? Math.round(
                  parseFloat(model.pricing.input_cache_read) * 1_000_000 * 100,
                ) / 100
              : undefined;
            const cacheWriteTokenCost = model.pricing.input_cache_write
              ? Math.round(
                  parseFloat(model.pricing.input_cache_write) * 1_000_000 * 100,
                ) / 100
              : undefined;

            models.push({
              id: providerConfig.id,
              name: model.name,
              contextLength: model.context_length,
              inputTokenCost: roundedInput,
              outputTokenCost: roundedOutput,
              cacheReadTokenCost,
              cacheWriteTokenCost,
            });

            updates.push({
              modelId: providerConfig.id,
              openRouterId,
              found: true,
              contextLength: model.context_length,
              inputTokenCost: roundedInput,
              outputTokenCost: roundedOutput,
              cacheReadTokenCost,
              cacheWriteTokenCost,
            });
          } else {
            updates.push({
              modelId: providerConfig.id,
              openRouterId,
              found: false,
            });
          }
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

        // Update contextWindow (lives at definition level, outside providers)
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

        // Update inputTokenCost and outputTokenCost inside providers array.
        // Match from the providerModel string (unique per provider) to find the right block.
        const escapedOpenRouterId = update.openRouterId.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

        // inputTokenCost: find providerModel: "xxx", then match inputTokenCost within same block
        const inputCostRegex = new RegExp(
          `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?inputTokenCost:\\s*)[\\d.]+`,
        );
        if (inputCostRegex.test(content)) {
          content = content.replace(
            inputCostRegex,
            `$1${update.inputTokenCost}`,
          );
        }

        // outputTokenCost: same approach
        const outputCostRegex = new RegExp(
          `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?outputTokenCost:\\s*)[\\d.]+`,
        );
        if (outputCostRegex.test(content)) {
          content = content.replace(
            outputCostRegex,
            `$1${update.outputTokenCost}`,
          );
        }

        // cacheReadTokenCost: update existing value or insert after outputTokenCost
        if (update.cacheReadTokenCost !== undefined) {
          const cacheReadUpdateRegex = new RegExp(
            `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?cacheReadTokenCost:\\s*)[\\d.]+`,
          );
          if (cacheReadUpdateRegex.test(content)) {
            content = content.replace(
              cacheReadUpdateRegex,
              `$1${update.cacheReadTokenCost}`,
            );
          } else {
            // Insert after outputTokenCost in this provider block
            const insertAfterOutputRegex = new RegExp(
              `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?outputTokenCost:\\s*[\\d.]+)(,?)`,
            );
            content = content.replace(
              insertAfterOutputRegex,
              `$1,\n        cacheReadTokenCost: ${update.cacheReadTokenCost}`,
            );
          }
        }

        // cacheWriteTokenCost: update existing value or insert after cacheReadTokenCost
        if (update.cacheWriteTokenCost !== undefined) {
          const cacheWriteUpdateRegex = new RegExp(
            `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?cacheWriteTokenCost:\\s*)[\\d.]+`,
          );
          if (cacheWriteUpdateRegex.test(content)) {
            content = content.replace(
              cacheWriteUpdateRegex,
              `$1${update.cacheWriteTokenCost}`,
            );
          } else {
            // Insert after cacheReadTokenCost (if present) or outputTokenCost
            const insertAfterCacheReadRegex = new RegExp(
              `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?cacheReadTokenCost:\\s*[\\d.]+)(,?)`,
            );
            const insertAfterOutputRegex = new RegExp(
              `(providerModel:\\s*"${escapedOpenRouterId}"[\\s\\S]*?outputTokenCost:\\s*[\\d.]+)(,?)`,
            );
            if (insertAfterCacheReadRegex.test(content)) {
              content = content.replace(
                insertAfterCacheReadRegex,
                `$1,\n        cacheWriteTokenCost: ${update.cacheWriteTokenCost}`,
              );
            } else {
              content = content.replace(
                insertAfterOutputRegex,
                `$1,\n        cacheWriteTokenCost: ${update.cacheWriteTokenCost}`,
              );
            }
          }
        }
      }

      // Write updated content back to file
      writeFileSync(modelsPath, content, "utf-8");

      // Categorize: updates only contains OpenRouter providers, so !found means missing from OpenRouter API
      const missingFromOpenRouter = updates.filter((u) => !u.found);

      // Count total OpenRouter providers across all definitions
      const totalOpenRouterProviders = Object.values(modelDefinitions).reduce(
        (count, def) =>
          count +
          def.providers.filter((p) => p.apiProvider === ApiProvider.OPENROUTER)
            .length,
        0,
      );

      logger.info("Model pricing update completed", {
        modelsFound: models.length,
        totalOpenRouterProviders,
        updatedCount,
        missingCount: missingFromOpenRouter.length,
        nonOpenRouterProviderCount: nonOpenRouterProviders.length,
      });

      return success({
        summary: {
          totalModels: Object.keys(modelDefinitions).length,
          modelsFound: models.length,
          modelsUpdated: updatedCount,
          fileUpdated: updatedCount > 0,
        },
        models,
        missingOpenRouterModels: missingFromOpenRouter.map((m) => ({
          modelId: m.modelId,
          openRouterId: m.openRouterId,
          suggestion: "Consider marking as LEGACY or removing from models.ts",
        })),
        nonOpenRouterModels: nonOpenRouterProviders.map((m) => ({
          modelId: m.modelId,
          provider: m.provider,
        })),
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to fetch OpenRouter models", parsedError);

      return fail({
        message: t("get.errors.unknown.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          error: parsedError.message,
        },
      });
    }
  }
}
