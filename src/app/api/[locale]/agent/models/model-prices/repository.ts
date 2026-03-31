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
import { DeepgramPriceFetcher } from "./providers/deepgram";
import { EdenAiPriceFetcher } from "./providers/eden-ai";
import { ElevenLabsPriceFetcher } from "./providers/elevenlabs";
import { FalAiPriceFetcher } from "./providers/fal-ai";
import { ModelslabPriceFetcher } from "./providers/modelslab";
import { OpenAiImagePriceFetcher } from "./providers/openai-images";
import { OpenAiSttPriceFetcher } from "./providers/openai-stt";
import { OpenAiTtsPriceFetcher } from "./providers/openai-tts";
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
  new OpenAiTtsPriceFetcher(),
  new ElevenLabsPriceFetcher(),
  new OpenAiSttPriceFetcher(),
  new DeepgramPriceFetcher(),
  new EdenAiPriceFetcher(),
  new ModelslabPriceFetcher(),
];

/** ISO date string YYYY-MM-DD */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Build the inline comment to place after a price value.
 * Format: // updated: YYYY-MM-DD from <source>
 * Replaces any existing trailing comment on that line.
 */
function buildUpdateComment(source: string): string {
  // Shorten URL sources to just the hostname for readability
  let shortSource = source;
  try {
    const url = new URL(source);
    shortSource = url.hostname.replace(/^www\./, "");
  } catch {
    // Not a URL - use as-is (e.g. "openrouter-api", "replicate-api")
  }
  return `// updated: ${today()} from ${shortSource}`;
}

/**
 * Replace a price value and its trailing comment in a line.
 * Input line example:  `        creditCostPerImage: 4, // updated: 2025-01-01 from openrouter`
 * Output:              `        creditCostPerImage: 4.2, // updated: 2026-03-31 from openrouter`
 */
function replaceValueAndComment(
  line: string,
  field: string,
  newValue: number,
  comment: string,
): string {
  // Match: field: <number><optional comma><optional existing comment>
  const lineRegex = new RegExp(`(${field}:\\s*)[\\d.]+([,]?)(?:\\s*//[^\n]*)?`);
  return line.replace(lineRegex, `$1${newValue}$2 ${comment}`);
}

/**
 * Apply a price update to the file content.
 * Updates the value AND sets/replaces the trailing comment on the price line.
 * Returns updated content and whether a change was made.
 */
function applyPriceUpdate(
  content: string,
  escapedProviderModel: string,
  field: string,
  newValue: number,
  source: string,
): { content: string; changed: boolean } {
  const comment = buildUpdateComment(source);

  // Find all blocks matching providerModel → field, update each
  // We do this line-by-line within the matched block to preserve formatting
  const blockRegex = new RegExp(
    `(providerModel:\\s*"${escapedProviderModel}"[\\s\\S]*?)(${field}:\\s*[\\d.]+[,]?(?:\\s*//[^\n]*)?)`,
    "g",
  );

  let changed = false;
  const updated = content.replace(
    blockRegex,
    // eslint-disable-next-line no-unused-vars
    (_: string, prefix: string, priceLine: string) => {
      const newLine = replaceValueAndComment(
        priceLine,
        field,
        newValue,
        comment,
      );
      if (newLine !== priceLine) {
        changed = true;
      }
      return prefix + newLine;
    },
  );

  return { content: updated, changed };
}

/**
 * Apply a cache cost field update (insert if missing, update if present).
 */
function applyCacheCostUpdate(
  content: string,
  escapedProviderModel: string,
  field: string,
  newValue: number,
  source: string,
  insertAfterField: string,
): { content: string; changed: boolean } {
  const comment = buildUpdateComment(source);

  // Try to update existing field first
  const updateRegex = new RegExp(
    `(providerModel:\\s*"${escapedProviderModel}"[\\s\\S]*?)(${field}:\\s*[\\d.]+[,]?(?:\\s*//[^\n]*)?)`,
  );
  if (updateRegex.test(content)) {
    let changed = false;
    const updated = content.replace(
      updateRegex,
      // eslint-disable-next-line no-unused-vars
      (_: string, prefix: string, priceLine: string) => {
        const newLine = replaceValueAndComment(
          priceLine,
          field,
          newValue,
          comment,
        );
        if (newLine !== priceLine) {
          changed = true;
        }
        return prefix + newLine;
      },
    );
    return { content: updated, changed };
  }

  // Insert after insertAfterField
  const insertRegex = new RegExp(
    `(providerModel:\\s*"${escapedProviderModel}"[\\s\\S]*?${insertAfterField}:\\s*[\\d.]+[,]?(?:\\s*//[^\n]*)?)(\\n)`,
  );
  if (insertRegex.test(content)) {
    const updated = content.replace(
      insertRegex,
      `$1\n        ${field}: ${newValue}, ${comment}$2`,
    );
    return { content: updated, changed: true };
  }

  return { content, changed: false };
}

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
        // contextWindow uses enum key, not providerModel
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
          const insertAfter =
            update.field === "cacheWriteTokenCost"
              ? "cacheReadTokenCost"
              : "outputTokenCost";
          const result = applyCacheCostUpdate(
            content,
            escaped,
            update.field,
            update.value,
            update.source,
            insertAfter,
          );
          if (result.changed) {
            content = result.content;
            updatedCount++;
          }
          continue;
        }

        // Standard field update with comment annotation
        const result = applyPriceUpdate(
          content,
          escaped,
          update.field,
          update.value,
          update.source,
        );
        if (result.changed) {
          content = result.content;
          updatedCount++;
        } else if (
          !new RegExp(`providerModel:\\s*"${escaped}"`).test(content)
        ) {
          logger.debug("Price pattern not found in models.ts", {
            providerModel: update.providerModel,
            field: update.field,
          });
        }
      }

      // Add/replace TODO comments for failures next to the price field line
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

        const todoComment = `// TODO: price not found from ${failure.provider}: ${failure.reason}`;

        // Find the providerModel line and add/replace TODO before it
        const providerModelLine = new RegExp(
          `([ \\t]*)(providerModel:\\s*"${escaped}")`,
        );
        const existingTodoBeforeModel = new RegExp(
          `// TODO: price not found[^\n]*\n[ \\t]*providerModel:\\s*"${escaped}"`,
        );

        if (providerModelLine.test(content)) {
          if (existingTodoBeforeModel.test(content)) {
            // Replace existing TODO comment
            content = content.replace(
              existingTodoBeforeModel,
              `${todoComment}\n        providerModel: "${providerConfig.providerModel}"`,
            );
          } else {
            // Insert TODO before providerModel line
            content = content.replace(
              providerModelLine,
              `$1${todoComment}\n$1$2`,
            );
          }
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
