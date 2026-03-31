/**
 * Unified Model Prices Repository
 *
 * Runs all price fetchers in parallel, then writes models.ts once.
 * Each provider lives in its own file under ./providers/.
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
import { modelDefinitions } from "../models";

import type { ModelPricesGetResponseOutput } from "./definition";
import type { ModelPricesT } from "./i18n";
import type { PriceFetcher, ProviderPriceResult } from "./providers/base";
import { FalAiPriceFetcher } from "./providers/fal-ai";
import { OpenAiImagePriceFetcher } from "./providers/openai-images";
import { OpenRouterImagePriceFetcher } from "./providers/openrouter-image";
import { OpenRouterTokenPriceFetcher } from "./providers/openrouter-token";
import { ReplicatePriceFetcher } from "./providers/replicate";

export type { PriceFetcher, ProviderPriceResult };

const ALL_FETCHERS: PriceFetcher[] = [
  new OpenRouterTokenPriceFetcher(),
  new OpenRouterImagePriceFetcher(),
  new ReplicatePriceFetcher(),
  new OpenAiImagePriceFetcher(),
  new FalAiPriceFetcher(),
];

export class ModelPricesRepository {
  static async fetchAndUpdate(
    logger: EndpointLogger,
    t: ModelPricesT,
  ): Promise<ResponseType<ModelPricesGetResponseOutput>> {
    try {
      const providerResults: ProviderPriceResult[] = await Promise.all(
        ALL_FETCHERS.map((fetcher) => fetcher.fetch(logger)),
      );

      const allUpdates = providerResults.flatMap((r) => r.updates);
      const allFailures = providerResults.flatMap((r) => r.failures);

      const modelsPath = join(
        process.cwd(),
        "src/app/api/[locale]/agent/models/models.ts",
      );
      let content = readFileSync(modelsPath, "utf-8");
      let updatedCount = 0;

      for (const update of allUpdates) {
        if (update.field === "contextWindow" && update.enumKey) {
          const regex = new RegExp(
            `(\\[ModelId\\.${update.enumKey}\\]:\\s*\\{[^}]*?contextWindow:\\s*)\\d+`,
            "s",
          );
          if (regex.test(content)) {
            const before = content;
            content = content.replace(regex, `$1${update.value}`);
            if (content !== before) {
              updatedCount++;
            }
          }
          continue;
        }

        if (!update.providerModel) {
          continue;
        }
        const escaped = update.providerModel.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );

        if (
          update.field === "cacheReadTokenCost" ||
          update.field === "cacheWriteTokenCost"
        ) {
          const updateRegex = new RegExp(
            `(providerModel:\\s*"${escaped}"[\\s\\S]*?${update.field}:\\s*)[\\d.]+`,
          );
          if (updateRegex.test(content)) {
            const before = content;
            content = content.replace(updateRegex, `$1${update.value}`);
            if (content !== before) {
              updatedCount++;
            }
          } else {
            const insertAfter =
              update.field === "cacheWriteTokenCost"
                ? "cacheReadTokenCost"
                : "outputTokenCost";
            const insertRegex = new RegExp(
              `(providerModel:\\s*"${escaped}"[\\s\\S]*?${insertAfter}:\\s*[\\d.]+)(,?)`,
            );
            if (insertRegex.test(content)) {
              content = content.replace(
                insertRegex,
                `$1,\n        ${update.field}: ${update.value}`,
              );
              updatedCount++;
            }
          }
          continue;
        }

        const regex = new RegExp(
          `(providerModel:\\s*"${escaped}"[\\s\\S]*?${update.field}:\\s*)[\\d.]+`,
        );
        if (regex.test(content)) {
          const before = content;
          content = content.replace(regex, `$1${update.value}`);
          if (content !== before) {
            updatedCount++;
          }
        } else {
          logger.debug("Price pattern not found in models.ts", {
            providerModel: update.providerModel,
            field: update.field,
          });
        }
      }

      // Add TODO comments for failures (models we know about but couldn't price)
      for (const failure of allFailures) {
        const modelEntry = Object.values(modelDefinitions).find((def) =>
          def.providers.some((p) => p.id === failure.modelId),
        );
        if (!modelEntry) {
          continue;
        }
        const providerConfig = modelEntry.providers.find(
          (p) => p.id === failure.modelId && p.apiProvider === failure.provider,
        );
        if (!providerConfig) {
          continue;
        }
        const escaped = providerConfig.providerModel.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        // Add TODO only if not already present
        const todoMarker = `// TODO: price not found`;
        const providerModelLine = new RegExp(
          `(\\s*)(providerModel:\\s*"${escaped}")`,
        );
        if (
          providerModelLine.test(content) &&
          !new RegExp(
            `${todoMarker}[^\n]*\n[^\n]*providerModel:\\s*"${escaped}"`,
          ).test(content)
        ) {
          content = content.replace(
            providerModelLine,
            `$1${todoMarker} from ${failure.provider}: ${failure.reason}\n$1$2`,
          );
        }
      }

      writeFileSync(modelsPath, content, "utf-8");

      logger.info("Unified model pricing update completed", {
        providers: ALL_FETCHERS.length,
        totalUpdates: allUpdates.length,
        written: updatedCount,
        failures: allFailures.length,
      });

      return success({
        summary: {
          totalProviders: ALL_FETCHERS.length,
          totalModels: allUpdates.length,
          modelsUpdated: updatedCount,
          fileUpdated: updatedCount > 0,
        },
        providerResults: providerResults.map((r) => ({
          provider: r.provider,
          modelsFound: r.modelsFound,
          modelsUpdated: r.modelsUpdated,
          error: r.error,
        })),
        updates: allUpdates.map((u) => ({
          modelId: u.modelId,
          name: u.name,
          provider: u.provider,
          field: u.field,
          value: u.value,
          source: u.source,
        })),
        failures: allFailures,
      });
    } catch (error) {
      const parsedError = parseError(error);
      logger.error("Failed to update model prices", parsedError);
      return fail({
        message: t("get.errors.unknown.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parsedError.message },
      });
    }
  }
}
