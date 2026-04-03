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
import type { ModelDefinition } from "@/app/api/[locale]/agent/models/models";

import type { Modality } from "@/app/api/[locale]/agent/models/enum";

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
import { FreedomGptPriceFetcher } from "./providers/freedomgpt";
import { UncensoredAiPriceFetcher } from "./providers/uncensored-ai";
import { chatModelDefinitions } from "../../ai-stream/models";
import { imageGenModelDefinitions } from "../../image-generation/models";
import { musicGenModelDefinitions } from "../../music-generation/models";
import { videoGenModelDefinitions } from "../../video-generation/models";
import { ttsModelDefinitions } from "../../text-to-speech/models";
import { sttModelDefinitions } from "../../speech-to-text/models";

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
  new UncensoredAiPriceFetcher(),
  new FreedomGptPriceFetcher(),
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
 * Check if a price line already has the correct value and a valid update comment.
 * Returns true if the line should be skipped (no update needed).
 */
function isAlreadyUpToDate(
  line: string,
  field: string,
  newValue: number,
): boolean {
  const regex = new RegExp(
    `${field}:\\s*${String(newValue).replace(/\./g, "\\.")}[,]?\\s*// updated: \\d{4}-\\d{2}-\\d{2} from `,
  );
  return regex.test(line);
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
      // Skip if value matches and line already has a valid update comment
      if (isAlreadyUpToDate(priceLine, field, newValue)) {
        return prefix + priceLine;
      }
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
        // Skip if value matches and line already has a valid update comment
        if (isAlreadyUpToDate(priceLine, field, newValue)) {
          return prefix + priceLine;
        }
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

/** Format a Modality[] as a TypeScript array literal, e.g. `["text", "image"]` */
function formatModalityArray(modalities: Modality[]): string {
  return `[${modalities.map((m) => `"${m}"`).join(", ")}]`;
}

/**
 * Check if a modality line already has the correct value and a valid update comment.
 */
function isModalityUpToDate(
  line: string,
  field: string,
  arrayStr: string,
): boolean {
  const escaped = arrayStr.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp(
    `${field}:\\s*${escaped}[,]?\\s*// updated: \\d{4}-\\d{2}-\\d{2} from `,
  );
  return regex.test(line);
}

/**
 * Apply a modality update to the file content.
 * Handles two source patterns:
 * 1. `...defaultLlmModality,` → replaced with explicit `inputs: [...], outputs: [...]`
 * 2. Existing `inputs: [...]` / `outputs: [...]` lines → updated in place
 *
 * Adds `// updated: YYYY-MM-DD from <source>` comment to each modality line.
 * Skips if value and comment are already correct.
 */
function applyModalityUpdate(
  content: string,
  enumPrefix: string,
  enumKey: string,
  inputs: Modality[],
  outputs: Modality[],
  source: string,
): { content: string; changed: boolean } {
  // Find the model definition block: [EnumPrefix.KEY]: {  ...  }
  // We need to locate it and update within it
  const blockStartRegex = new RegExp(
    `\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{`,
  );
  const blockStartMatch = blockStartRegex.exec(content);
  if (!blockStartMatch) {
    return { content, changed: false };
  }

  const inputsStr = formatModalityArray(inputs);
  const outputsStr = formatModalityArray(outputs);
  const comment = buildUpdateComment(source);
  let changed = false;

  // Pattern 1: Replace `...defaultLlmModality,` with explicit inputs/outputs
  const defaultModalityRegex = new RegExp(
    `(\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{[\\s\\S]*?)(\\.\\.\\.defaultLlmModality,)`,
  );
  if (defaultModalityRegex.test(content)) {
    const newContent = content.replace(
      defaultModalityRegex,
      `$1inputs: ${inputsStr}, ${comment}\n    outputs: ${outputsStr}, ${comment}`,
    );
    if (newContent !== content) {
      return { content: newContent, changed: true };
    }
  }

  // Pattern 2: Update existing inputs: [...] line (with optional trailing comment)
  const inputsRegex = new RegExp(
    `(\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{[\\s\\S]*?)(inputs:\\s*\\[[^\\]]*\\][,]?(?:\\s*//[^\n]*)?)`,
  );
  const inputsMatch = inputsRegex.exec(content);
  if (inputsMatch) {
    const existingLine = inputsMatch[2];
    const upToDate = isModalityUpToDate(existingLine, "inputs", inputsStr);
    if (!upToDate) {
      const replacement = `inputs: ${inputsStr}, ${comment}`;
      const newContent = content.replace(inputsRegex, `$1${replacement}`);
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }
  }

  // Pattern 2b: Update existing outputs: [...] line (with optional trailing comment)
  const outputsRegex = new RegExp(
    `(\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{[\\s\\S]*?)(outputs:\\s*\\[[^\\]]*\\][,]?(?:\\s*//[^\n]*)?)`,
  );
  const outputsMatch = outputsRegex.exec(content);
  if (outputsMatch) {
    const existingLine = outputsMatch[2];
    if (!isModalityUpToDate(existingLine, "outputs", outputsStr)) {
      const newContent = content.replace(
        outputsRegex,
        `$1outputs: ${outputsStr}, ${comment}`,
      );
      if (newContent !== content) {
        content = newContent;
        changed = true;
      }
    }
  }

  return { content, changed };
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
      const allModalityUpdates = providerResults.flatMap(
        (r) => r.modalityUpdates ?? [],
      );
      const allFailures = providerResults.flatMap((r) => r.failures);

      const agentDir = join(process.cwd(), "src/app/api/[locale]/agent");
      // Role file paths — model definitions live in modality-specific subdirs
      const roleFilePaths: Record<string, string> = {
        chat: join(agentDir, "ai-stream/models.ts"),
        "image-gen": join(agentDir, "image-generation/models.ts"),
        "music-gen": join(agentDir, "music-generation/models.ts"),
        "video-gen": join(agentDir, "video-generation/models.ts"),
        tts: join(agentDir, "text-to-speech/models.ts"),
        stt: join(agentDir, "speech-to-text/models.ts"),
      };
      // Build a map of modelId → role for fast lookup
      const modelIdToRole: Record<string, string> = {};
      for (const id of Object.keys(chatModelDefinitions)) {
        modelIdToRole[id] = "chat";
      }
      for (const id of Object.keys(imageGenModelDefinitions)) {
        modelIdToRole[id] = "image-gen";
      }
      for (const id of Object.keys(musicGenModelDefinitions)) {
        modelIdToRole[id] = "music-gen";
      }
      for (const id of Object.keys(videoGenModelDefinitions)) {
        modelIdToRole[id] = "video-gen";
      }
      for (const id of Object.keys(ttsModelDefinitions)) {
        modelIdToRole[id] = "tts";
      }
      for (const id of Object.keys(sttModelDefinitions)) {
        modelIdToRole[id] = "stt";
      }

      // Load all role file contents
      const roleFileContents: Record<string, string> = {};
      for (const [role, path] of Object.entries(roleFilePaths)) {
        roleFileContents[role] = readFileSync(path, "utf-8");
      }
      let updatedCount = 0;

      // Helper to get role-specific enum prefix for contextWindow regex
      const enumPrefixForRole: Record<string, string> = {
        chat: "ChatModelId",
        "image-gen": "ImageGenModelId",
        "music-gen": "MusicGenModelId",
        "video-gen": "VideoGenModelId",
        tts: "TtsModelId",
        stt: "SttModelId",
      };

      for (const update of allUpdates) {
        const role = modelIdToRole[update.modelId];
        if (!role) {
          continue;
        }
        const content = roleFileContents[role];
        if (!content) {
          continue;
        }

        // contextWindow uses enum key, not providerModel
        if (update.field === "contextWindow" && update.enumKey) {
          const enumPrefix = enumPrefixForRole[role] ?? "ChatModelId";
          const regex = new RegExp(
            `(\\[${enumPrefix}\\.${update.enumKey}\\]:\\s*\\{[^}]*?contextWindow:\\s*)\\d+`,
            "s",
          );
          if (regex.test(content)) {
            const before = content;
            const updated = content.replace(regex, `$1${update.value}`);
            if (updated !== before) {
              roleFileContents[role] = updated;
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
            roleFileContents[role],
            escaped,
            update.field,
            update.value,
            update.source,
            insertAfter,
          );
          if (result.changed) {
            roleFileContents[role] = result.content;
            updatedCount++;
          }
          continue;
        }

        // Standard field update with comment annotation
        const result = applyPriceUpdate(
          roleFileContents[role],
          escaped,
          update.field,
          update.value,
          update.source,
        );
        if (result.changed) {
          roleFileContents[role] = result.content;
          updatedCount++;
        } else if (
          !new RegExp(`providerModel:\\s*"${escaped}"`).test(
            roleFileContents[role],
          )
        ) {
          logger.debug("Price pattern not found in role file", {
            providerModel: update.providerModel,
            field: update.field,
            role,
          });
        }
      }

      // Apply modality updates (inputs/outputs from API architecture data)
      // For chat models: use fetched modality data from OpenRouter
      // Index modality updates by enumKey for dedup and cross-role lookup
      const modalityByEnumKey = new Map<
        string,
        { inputs: Modality[]; outputs: Modality[]; source: string }
      >();
      for (const modUpdate of allModalityUpdates) {
        modalityByEnumKey.set(modUpdate.enumKey, {
          inputs: modUpdate.inputs,
          outputs: modUpdate.outputs,
          source: modUpdate.source,
        });
      }

      // Apply modality updates to ALL role files (handles models registered in multiple roles)
      for (const [role, fileContent] of Object.entries(roleFileContents)) {
        const enumPrefix = enumPrefixForRole[role] ?? role;
        for (const [enumKey, modData] of modalityByEnumKey) {
          // Check if this enum key exists in this role file
          const blockRegex = new RegExp(
            `\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{`,
          );
          if (!blockRegex.test(fileContent)) {
            continue;
          }
          const result = applyModalityUpdate(
            roleFileContents[role],
            enumPrefix,
            enumKey,
            modData.inputs,
            modData.outputs,
            modData.source,
          );
          if (result.changed) {
            roleFileContents[role] = result.content;
            updatedCount++;
          }
        }
      }

      // For non-chat models: apply deterministic modalities based on role
      const roleModalityDefaults: Record<
        string,
        { inputs: Modality[]; outputs: Modality[] } | undefined
      > = {
        "image-gen": { inputs: ["text"], outputs: ["image"] },
        "music-gen": { inputs: ["text"], outputs: ["audio"] },
        "video-gen": { inputs: ["text"], outputs: ["video"] },
        tts: { inputs: ["text"], outputs: ["audio"] },
        stt: { inputs: ["audio"], outputs: ["text"] },
      };
      const allNonChatDefs: Record<string, Record<string, ModelDefinition>> = {
        "image-gen": { ...imageGenModelDefinitions },
        "music-gen": { ...musicGenModelDefinitions },
        "video-gen": { ...videoGenModelDefinitions },
        tts: { ...ttsModelDefinitions },
        stt: { ...sttModelDefinitions },
      };
      for (const [role, defs] of Object.entries(allNonChatDefs)) {
        const defaults = roleModalityDefaults[role];
        if (!defaults || !roleFileContents[role]) {
          continue;
        }
        const enumPrefix = enumPrefixForRole[role] ?? role;
        const fileContent = roleFileContents[role];
        for (const modelId of Object.keys(defs)) {
          const escapedModelId = modelId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const enumKeyMatch = new RegExp(
            `(\\w+)\\s*=\\s*"${escapedModelId}"`,
          ).exec(fileContent);
          const enumKey = enumKeyMatch?.[1];
          if (!enumKey) {
            continue;
          }
          const result = applyModalityUpdate(
            roleFileContents[role],
            enumPrefix,
            enumKey,
            defaults.inputs,
            defaults.outputs,
            `${role}-deterministic`,
          );
          if (result.changed) {
            roleFileContents[role] = result.content;
            updatedCount++;
          }
        }
      }

      // Track which model IDs had modality verification
      const modelIdsWithModalityVerified = new Set(
        allModalityUpdates.map((u) => u.modelId),
      );
      // Non-chat models always have deterministic modalities
      for (const defs of Object.values(allNonChatDefs)) {
        for (const modelId of Object.keys(defs)) {
          modelIdsWithModalityVerified.add(modelId);
        }
      }
      // Track which model IDs had price fetch successes
      // A "primary" update is one of the core cost fields (not context window or cache fields)
      const modelIdsWithPriceSuccess = new Set(
        allUpdates
          .filter(
            (u) =>
              u.field !== "contextWindow" &&
              u.field !== "cacheReadTokenCost" &&
              u.field !== "cacheWriteTokenCost",
          )
          .map((u) => u.modelId),
      );

      // Disable any model without verified price OR modality (unless enabledWithoutPrice)
      const modelIdsToDisable = new Set(
        Object.keys(modelIdToRole).filter(
          (id) =>
            !modelIdsWithPriceSuccess.has(id) ||
            !modelIdsWithModalityVerified.has(id),
        ),
      );

      // Update enabled: false / remove it based on price fetch results.
      // We search each role file for the model's enum key block and toggle the flag.
      const allModelDefsForEnabled: Record<
        string,
        Record<string, ModelDefinition>
      > = {
        chat: { ...chatModelDefinitions },
        "image-gen": { ...imageGenModelDefinitions },
        "music-gen": { ...musicGenModelDefinitions },
        "video-gen": { ...videoGenModelDefinitions },
        tts: { ...ttsModelDefinitions },
        stt: { ...sttModelDefinitions },
      };

      for (const [role, defs] of Object.entries(allModelDefsForEnabled)) {
        const enumPrefix = enumPrefixForRole[role] ?? "ChatModelId";
        const fileContent = roleFileContents[role];
        if (!fileContent) {
          continue;
        }

        for (const [modelId, def] of Object.entries(defs)) {
          if (modelIdToRole[modelId] !== role) {
            continue;
          }
          // Never auto-disable models that have explicit price override
          if (def.enabledWithoutPrice) {
            continue;
          }

          // Find the enum key name for this model ID value in the file
          const escapedModelId = modelId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const enumKeyMatch = new RegExp(
            `(\\w+)\\s*=\\s*"${escapedModelId}"`,
          ).exec(fileContent);
          const enumKey = enumKeyMatch?.[1];
          if (!enumKey) {
            continue;
          }

          const blockStartPattern = new RegExp(
            `(\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{)`,
          );

          if (modelIdsToDisable.has(modelId)) {
            // Add enabled: false after the opening brace if not already present
            const alreadyDisabled = new RegExp(
              `\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{[\\s\\S]*?enabled:\\s*false`,
            );
            if (
              !alreadyDisabled.test(roleFileContents[role]) &&
              blockStartPattern.test(roleFileContents[role])
            ) {
              const hasPrice = modelIdsWithPriceSuccess.has(modelId);
              const hasModality = modelIdsWithModalityVerified.has(modelId);
              const reasons: string[] = [];
              if (!hasPrice) {
                reasons.push("price not verified");
              }
              if (!hasModality) {
                reasons.push("modality not verified");
              }
              const disableReason = reasons.join(" + ");
              roleFileContents[role] = roleFileContents[role].replace(
                blockStartPattern,
                `$1\n    enabled: false, // auto-disabled: ${disableReason}`,
              );
              updatedCount++;
            }
          } else if (
            modelIdsWithPriceSuccess.has(modelId) &&
            modelIdsWithModalityVerified.has(modelId)
          ) {
            // Remove enabled: false if present (price and modality both verified)
            const enabledFalsePattern = new RegExp(
              `(\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{)\\n    enabled:\\s*false[^\n]*\\n`,
            );
            if (enabledFalsePattern.test(roleFileContents[role])) {
              roleFileContents[role] = roleFileContents[role].replace(
                enabledFalsePattern,
                "$1\n",
              );
              updatedCount++;
            }
          }
        }
      }

      // Write updated role files back to disk
      for (const [role, path] of Object.entries(roleFilePaths)) {
        const originalContent = readFileSync(path, "utf-8");
        if (roleFileContents[role] !== originalContent) {
          writeFileSync(path, roleFileContents[role], "utf-8");
        }
      }

      // Re-generate vision model enums from the (possibly updated) chat model definitions.
      // We use runtime imports because model files have just been written back to disk
      // and the in-memory defs reflect the latest modality data.
      try {
        const { generateVisionEnumFileContent } =
          await import("../../ai-stream/vision-enum-generator");
        const { ChatModelId: ChatModelIdEnum } =
          await import("../../ai-stream/models");
        const content = generateVisionEnumFileContent(
          chatModelDefinitions,
          Object.entries(ChatModelIdEnum) as Array<[string, string]>,
        );
        const visionGenPath = join(
          agentDir,
          "ai-stream/vision-models.generated.ts",
        );
        const existingVision = readFileSync(visionGenPath, "utf-8").toString();
        if (content !== existingVision) {
          writeFileSync(visionGenPath, content, "utf-8");
          logger.info("Vision model enums regenerated");
        }
      } catch (visionErr) {
        logger.warn(
          `Vision enum generation failed: ${parseError(visionErr).message}`,
        );
      }

      // Re-generate media-gen model enums from chat model output modalities
      try {
        const { updateMediaGenEnumFile } =
          await import("../../ai-stream/media-gen-enum-generator");
        const { ChatModelId: ChatModelIdEnum } =
          await import("../../ai-stream/models");
        const chatEnumEntries = Object.entries(ChatModelIdEnum) as Array<
          [string, string]
        >;

        updateMediaGenEnumFile(
          {
            filePath: join(agentDir, "image-generation/models.ts"),
            modality: "image",
          },
          chatModelDefinitions,
          chatEnumEntries,
          logger,
        );
        updateMediaGenEnumFile(
          {
            filePath: join(agentDir, "music-generation/models.ts"),
            modality: "audio",
          },
          chatModelDefinitions,
          chatEnumEntries,
          logger,
        );
        updateMediaGenEnumFile(
          {
            filePath: join(agentDir, "video-generation/models.ts"),
            modality: "video",
          },
          chatModelDefinitions,
          chatEnumEntries,
          logger,
        );
      } catch (mediaGenErr) {
        logger.warn(
          `Media-gen enum generation failed: ${parseError(mediaGenErr).message}`,
        );
      }

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
