/**
 * Unified Model Prices Repository
 *
 * Runs all price fetchers in parallel and computes the proposed source diff.
 * Each provider lives in its own file under ./providers/.
 */

import "server-only";

import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { createPatch } from "diff";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { Platform } from "next-vibe/platforms/platforms";

import { getSrcDir } from "@/env/paths";

import { generateMediaGenInlineEnumContent } from "../../ai-stream/model-enums-generator/media-gen-enum-generator";
import { generateVisionEnumFileContent } from "../../ai-stream/model-enums-generator/vision-enum-generator";
import { chatModelDefinitions, ChatModelId } from "../../ai-stream/models";
import { agentEnv } from "../../env";
import { imageGenModelDefinitions } from "../../image-generation/models";
import { musicGenModelDefinitions } from "../../music-generation/models";
import { sttModelDefinitions } from "../../speech-to-text/models";
import { ttsModelDefinitions } from "../../text-to-speech/models";
import {
  deriveVideoModelInputs,
  videoGenModelDefinitions,
} from "../../video-generation/models";
import type { Modality } from "../enum";
import type { ModelDefinition } from "../models";
import { ApiProvider } from "../models";
import type { ModelPricesGetResponseOutput } from "./definition";
import type { ModelPricesT } from "./i18n";
import type {
  PriceFetcher,
  ProviderEntryOperation,
  ProviderPriceResult,
  SettingsUpdate,
} from "./providers/base";
import { tariffLiteral } from "./providers/base";
import { DeepgramPriceFetcher } from "./providers/deepgram";
import { EdenAiPriceFetcher } from "./providers/eden-ai";
import { ElevenLabsPriceFetcher } from "./providers/elevenlabs";
import { FalAiPriceFetcher } from "./providers/fal-ai";
import { FreedomGptPriceFetcher } from "./providers/freedomgpt";
import { GabAiPriceFetcher } from "./providers/gab-ai";
import { ModelslabPriceFetcher } from "./providers/modelslab";
import { NanoGptPriceFetcher } from "./providers/nano-gpt";
import { OpenAiImagePriceFetcher } from "./providers/openai-images";
import { OpenAiSttPriceFetcher } from "./providers/openai-stt";
import { OpenAiTtsPriceFetcher } from "./providers/openai-tts";
import { OpenRouterAudioPriceFetcher } from "./providers/openrouter-audio";
import { OpenRouterImagePriceFetcher } from "./providers/openrouter-image";
import { OpenRouterTokenPriceFetcher } from "./providers/openrouter-token";
import { OpenRouterVideoPriceFetcher } from "./providers/openrouter-video";
import { ReplicatePriceFetcher } from "./providers/replicate";
import { UnbottledPriceFetcher } from "./providers/unbottled";
import { UncensoredAiPriceFetcher } from "./providers/uncensored-ai";
import { VenicePriceFetcher } from "./providers/venice-ai";
import {
  findField,
  formatTsLiteral,
  isRelayRowAt,
  literalsEqual,
  patchRelayBlock,
} from "./source-patch";

export type { PriceFetcher, ProviderPriceResult };

/** Fetchers that run on every platform */
const BASE_FETCHERS: PriceFetcher[] = [
  new OpenRouterTokenPriceFetcher(),
  new OpenRouterAudioPriceFetcher(),
  new OpenRouterImagePriceFetcher(),
  new OpenRouterVideoPriceFetcher(),
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
  new GabAiPriceFetcher(),
  new VenicePriceFetcher(),
  new NanoGptPriceFetcher(),
];

/** Unbottled fetcher - web-only, instantiated per call with platform */
const UNBOTTLED_FETCHER = new UnbottledPriceFetcher();

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
 * Check if a price line already has the correct value (comment ignored).
 * Returns true if the line should be skipped (no update needed).
 * Only updates the timestamp when the actual value changes - preserves the
 * original date so you can see when a price last *actually* changed.
 */
function isAlreadyUpToDate(
  line: string,
  field: string,
  newValue: number,
): boolean {
  const value = new RegExp(`${field}:\\s*([\\d.]+)`).exec(line)?.[1];
  return value !== undefined && Number(value) === newValue;
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
  skipRelayRows: boolean,
): { content: string; changed: boolean } {
  const comment = buildUpdateComment(source);

  // Find all blocks matching providerModel → field, update each
  // We do this line-by-line within the matched block to preserve formatting
  const blockRegex = new RegExp(
    `(providerModel:\\s*"${escapedProviderModel}"[^}]*?)(${field}:\\s*[\\d.]+[,]?(?:\\s*//[^\n]*)?)`,
    "g",
  );

  let changed = false;
  const updated = content.replace(
    blockRegex,
    (fullMatch: string, prefix: string, priceLine: string, offset: number) => {
      // fullMatch === prefix + priceLine by regex definition; prefix used to reconstruct
      // Upstream prices never land on a relay row sharing the providerModel.
      if (skipRelayRows && isRelayRowAt(content, offset)) {
        return fullMatch;
      }
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
  skipRelayRows: boolean,
): { content: string; changed: boolean } {
  const comment = buildUpdateComment(source);

  // Match only fields at the provider's indentation. Nested tariffs have
  // identical field names and may precede the base cache rates.
  const routes = new RegExp(
    `^( *)providerModel: *"${escapedProviderModel}",[^\\n]*\\n(?:\\1[^\\n]*\\n)*`,
    "gm",
  );
  let changed = false;
  const updated = content.replace(
    routes,
    (route: string, indent: string, offset: number) => {
      if (skipRelayRows && isRelayRowAt(content, offset)) {
        return route;
      }
      const fieldLine = new RegExp(`^${indent}${field}: [^\\n]*`, "m");
      const line = route.match(fieldLine)?.[0];
      if (line !== undefined) {
        if (isAlreadyUpToDate(line, field, newValue)) {
          return route;
        }
        changed = true;
        return route.replace(
          fieldLine,
          replaceValueAndComment(line, field, newValue, comment),
        );
      }
      const anchor = new RegExp(
        `^(${indent}${insertAfterField}: [^\\n]*)\\n`,
        "m",
      );
      if (!anchor.test(route)) {
        return route;
      }
      changed = true;
      return route.replace(
        anchor,
        `$1\n${indent}${field}: ${newValue}, ${comment}\n`,
      );
    },
  );
  return { content: updated, changed };
}

/**
 * Apply a settings update (array/object field) to the file content.
 * Inserts the field if missing, updates if present.
 * Placed right after creditCostPerSecond (or similar cost field) in the provider block.
 */
export function applySettingsUpdate(
  content: string,
  update: SettingsUpdate,
): { content: string; changed: boolean } {
  const comment = buildUpdateComment(update.source);

  // Scope all matching to within the single provider block containing this providerModel.
  // Find the block: from `providerModel: "..."` to the next `      },` (6-space closing brace).
  const scopeStart = update.enumKey
    ? content.indexOf(`[ChatModelId.${update.enumKey}]: {`)
    : 0;
  if (scopeStart < 0) {
    return { content, changed: false };
  }
  const scopeEnd = update.enumKey
    ? content.indexOf("\n  },", scopeStart)
    : content.length;
  const scope = content.slice(scopeStart, scopeEnd);
  const providerKey =
    update.apiProvider &&
    Object.entries(ApiProvider).find(
      ([, value]) => value === update.apiProvider,
    )?.[0];
  const providerLine = providerKey
    ? `apiProvider: ApiProvider.${providerKey},\n        `
    : "";
  const marker = `providerModel: "${update.providerModel}"`;
  const match = scope.indexOf(providerLine + marker);
  const pmIdx = match < 0 ? -1 : scopeStart + match + providerLine.length;
  if (pmIdx === -1) {
    return { content, changed: false };
  }
  const blockEndIdx = content.indexOf("\n      },", pmIdx);
  if (blockEndIdx === -1) {
    return { content, changed: false };
  }
  const blockContent = content.slice(pmIdx, blockEndIdx);
  const indent = content.slice(content.lastIndexOf("\n", pmIdx) + 1, pmIdx);
  const literal = formatTsLiteral(update.tsLiteral, indent, update.field);

  const span = findField(blockContent, indent, update.field);
  if (span) {
    // Same value in different formatting is NOT a change: keep the line,
    // its formatting and its original update date.
    if (literalsEqual(span.value, literal)) {
      return { content, changed: false };
    }
    const newBlock = `${blockContent.slice(0, span.lineStart)}${indent}${update.field}: ${literal}, ${comment}${blockContent.slice(span.lineEnd)}`;
    return {
      content:
        content.slice(0, pmIdx) +
        newBlock +
        content.slice(pmIdx + blockContent.length),
      changed: true,
    };
  }

  // Field doesn't exist — insert after the cost field within the block
  const costRegex = new RegExp(
    `((?:outputTokenCost|creditCostPerSecond|creditCostPerImage|creditCostPerClip):\\s*[\\d.]+[,]?(?:\\s*//[^\n]*)?)(\\n)`,
  );
  const costMatch = costRegex.exec(blockContent);
  if (costMatch) {
    const insertAt = costMatch.index + costMatch[0].length;
    const newBlock = `${blockContent.slice(0, insertAt)}${indent}${update.field}: ${literal}, ${comment}\n${blockContent.slice(insertAt)}`;
    return {
      content:
        content.slice(0, pmIdx) +
        newBlock +
        content.slice(pmIdx + blockContent.length),
      changed: true,
    };
  }

  return { content, changed: false };
}

/** Format a Modality[] as a TypeScript array literal, e.g. `["text", "image"]` */
function formatModalityArray(modalities: Modality[]): string {
  return `[${modalities.map((m) => `"${m}"`).join(", ")}]`;
}

/**
 * Check if a modality line already holds the given value. The trailing
 * comment does not matter: a line without one is still up to date, and
 * rewriting it would only add a fresh date to an unchanged value.
 */
function isModalityUpToDate(
  line: string,
  field: string,
  arrayStr: string,
): boolean {
  const value = new RegExp(`${field}:\\s*(\\[[^\\]]*\\])`).exec(line)?.[1];
  return value !== undefined && literalsEqual(value, arrayStr);
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

// ============================================
// PROVIDER ENTRY OPERATIONS (add/remove)
// ============================================

/** Enum prefix by role for model definition blocks */
const ENUM_PREFIX_BY_ROLE: Record<string, string> = {
  chat: "ChatModelId",
  "image-gen": "ImageGenModelId",
  "music-gen": "MusicGenModelId",
  "video-gen": "VideoGenModelId",
  tts: "TtsModelId",
  stt: "SttModelId",
};

const ENTRY_INDENT = "        ";

/**
 * Build the TypeScript source for an UNBOTTLED provider entry from a typed op.
 * All cost fields in op are already marked up. Non-cost fields are copied verbatim.
 */
function buildUnbottledEntrySource(
  enumPrefix: string,
  enumKey: string,
  op: ProviderEntryOperation,
): string {
  const comment = buildUpdateComment(op.source);
  const lines: string[] = [
    `        id: ${enumPrefix}.${enumKey},`,
    `        apiProvider: ApiProvider.UNBOTTLED,`,
    `        providerModel: "${op.providerModel}",`,
  ];

  // Token-based costs
  if (typeof op.inputTokenCost === "number") {
    lines.push(`        creditCost: calculateCreditCost,`);
    lines.push(`        inputTokenCost: ${op.inputTokenCost}, ${comment}`);
  }
  if (typeof op.outputTokenCost === "number") {
    lines.push(`        outputTokenCost: ${op.outputTokenCost}, ${comment}`);
  }
  if (typeof op.cacheReadTokenCost === "number") {
    lines.push(
      `        cacheReadTokenCost: ${op.cacheReadTokenCost}, ${comment}`,
    );
  }
  if (typeof op.cacheWriteTokenCost === "number") {
    lines.push(
      `        cacheWriteTokenCost: ${op.cacheWriteTokenCost}, ${comment}`,
    );
  }
  if (typeof op.cacheWrite1hTokenCost === "number") {
    lines.push(
      `        cacheWrite1hTokenCost: ${op.cacheWrite1hTokenCost}, ${comment}`,
    );
  }
  if (op.pricingTiers?.length) {
    lines.push(
      `        pricingTiers: ${tariffLiteral(op.pricingTiers)}, ${comment}`,
    );
  }
  if (typeof op.imageOutputTokenCost === "number") {
    lines.push(
      `        imageOutputTokenCost: ${op.imageOutputTokenCost}, ${comment}`,
    );
  }

  // Flat credit cost (non-token)
  if (typeof op.creditCost === "number") {
    lines.push(`        creditCost: ${op.creditCost}, ${comment}`);
  }

  // Per-image
  if (typeof op.creditCostPerImage === "number") {
    lines.push(
      `        creditCostPerImage: ${op.creditCostPerImage}, ${comment}`,
    );
  }

  // Per-second (video / STT)
  if (typeof op.creditCostPerSecond === "number") {
    lines.push(
      `        creditCostPerSecond: ${op.creditCostPerSecond}, ${comment}`,
    );
  }

  // Per-clip (music)
  if (typeof op.creditCostPerClip === "number") {
    lines.push(
      `        creditCostPerClip: ${op.creditCostPerClip}, ${comment}`,
    );
  }

  // Per-character (TTS)
  if (typeof op.creditCostPerCharacter === "number") {
    lines.push(
      `        creditCostPerCharacter: ${op.creditCostPerCharacter}, ${comment}`,
    );
  }

  // Non-cost fields
  if (op.defaultDurationSeconds !== undefined) {
    lines.push(`        defaultDurationSeconds: ${op.defaultDurationSeconds},`);
  }
  if (op.minDurationSeconds !== undefined) {
    lines.push(`        minDurationSeconds: ${op.minDurationSeconds},`);
  }
  if (op.maxDurationSeconds !== undefined) {
    lines.push(`        maxDurationSeconds: ${op.maxDurationSeconds},`);
  }
  if (op.supportedDurations !== undefined) {
    lines.push(
      `        supportedDurations: ${formatTsLiteral(JSON.stringify(op.supportedDurations), ENTRY_INDENT, "supportedDurations")},`,
    );
  }
  if (op.supportedResolutions !== undefined) {
    lines.push(
      `        supportedResolutions: ${formatTsLiteral(JSON.stringify(op.supportedResolutions), ENTRY_INDENT, "supportedResolutions")},`,
    );
  }
  if (op.supportedAspectRatios !== undefined) {
    lines.push(
      `        supportedAspectRatios: ${formatTsLiteral(JSON.stringify(op.supportedAspectRatios), ENTRY_INDENT, "supportedAspectRatios")},`,
    );
  }
  if (op.supportedSizes !== undefined) {
    lines.push(
      `        supportedSizes: ${formatTsLiteral(JSON.stringify(op.supportedSizes), ENTRY_INDENT, "supportedSizes")},`,
    );
  }
  if (op.supportedQualities !== undefined) {
    lines.push(
      `        supportedQualities: ${formatTsLiteral(JSON.stringify(op.supportedQualities), ENTRY_INDENT, "supportedQualities")},`,
    );
  }
  if (op.pricingByResolution !== undefined) {
    lines.push(
      `        pricingByResolution: ${formatTsLiteral(JSON.stringify(op.pricingByResolution), ENTRY_INDENT, "pricingByResolution")}, ${comment}`,
    );
  }
  if (op.pricingBySize !== undefined) {
    lines.push(
      `        pricingBySize: ${formatTsLiteral(JSON.stringify(op.pricingBySize), ENTRY_INDENT, "pricingBySize")}, ${comment}`,
    );
  }
  if (op.pricingByQuality !== undefined) {
    lines.push(
      `        pricingByQuality: ${formatTsLiteral(JSON.stringify(op.pricingByQuality), ENTRY_INDENT, "pricingByQuality")}, ${comment}`,
    );
  }

  return `      {\n${lines.join("\n")}\n      },\n`;
}

export function addProviderEntry(
  content: string,
  op: ProviderEntryOperation,
): { content: string; changed: boolean } {
  const enumPrefix = ENUM_PREFIX_BY_ROLE[op.role];
  if (!enumPrefix) {
    return { content, changed: false };
  }

  const entry = buildUnbottledEntrySource(enumPrefix, op.enumKey, op);

  // Find providers array close ] to insert before it
  const blockStart = new RegExp(`\\[${enumPrefix}\\.${op.enumKey}\\]:\\s*\\{`);
  const blockMatch = blockStart.exec(content);
  if (!blockMatch) {
    return { content, changed: false };
  }

  const providersOpenRegex = /providers:\s*\[/g;
  providersOpenRegex.lastIndex = blockMatch.index;
  const providersMatch = providersOpenRegex.exec(content);
  if (!providersMatch) {
    return { content, changed: false };
  }

  const openIdx = providersMatch.index + providersMatch[0].length - 1;
  let depth = 1;
  let closeIdx = -1;
  for (let i = openIdx + 1; i < content.length; i++) {
    if (content[i] === "[") {
      depth++;
    }
    if (content[i] === "]") {
      depth--;
    }
    if (depth === 0) {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    return { content, changed: false };
  }

  // Existence check bounded to THIS model's providers array — an unbounded
  // lookahead would match any LATER model's UNBOTTLED entry in the file and
  // silently skip every add.
  if (content.slice(openIdx, closeIdx).includes("ApiProvider.UNBOTTLED")) {
    return { content, changed: false };
  }

  // Insert at the start of the `]` line so the entry keeps its own 6-space
  // indent (inserting right before `]` stacked the `    ]` indent on top).
  const lineStart = content.lastIndexOf("\n", closeIdx) + 1;
  const insertAt =
    content.slice(lineStart, closeIdx).trim() === "" ? lineStart : closeIdx;
  const updated = content.slice(0, insertAt) + entry + content.slice(insertAt);
  return { content: updated, changed: true };
}

/**
 * Update an existing UNBOTTLED relay entry from the typed op, in place.
 * Only price fields are patched, and only when their value changed. The relay
 * row's own capability fields (sizes, aspect ratios, durations, passthrough
 * params) describe what the cloud route supports and are never rewritten
 * from the primary provider.
 */
export function updateUnbottledEntry(
  content: string,
  op: ProviderEntryOperation,
): { content: string; changed: boolean } {
  const enumPrefix = ENUM_PREFIX_BY_ROLE[op.role];
  if (!enumPrefix) {
    return { content, changed: false };
  }

  // Find and replace the existing UNBOTTLED block
  const blockStart = new RegExp(`\\[${enumPrefix}\\.${op.enumKey}\\]:\\s*\\{`);
  const blockMatch = blockStart.exec(content);
  if (!blockMatch) {
    return { content, changed: false };
  }

  const providersOpenRegex = /providers:\s*\[/g;
  providersOpenRegex.lastIndex = blockMatch.index;
  const providersMatch = providersOpenRegex.exec(content);
  if (!providersMatch) {
    return { content, changed: false };
  }

  const openIdx = providersMatch.index + providersMatch[0].length - 1;
  let depth = 1;
  let closeIdx = -1;
  for (let i = openIdx + 1; i < content.length; i++) {
    if (content[i] === "[") {
      depth++;
    }
    if (content[i] === "]") {
      depth--;
    }
    if (depth === 0) {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    return { content, changed: false };
  }

  const providersArrayContent = content.slice(openIdx + 1, closeIdx);

  // Find the UNBOTTLED block within the providers array
  let objDepth = 0;
  let objStart = -1;
  let unbottledStart = -1;
  let unbottledEnd = -1;
  for (let i = 0; i < providersArrayContent.length; i++) {
    if (providersArrayContent[i] === "{") {
      if (objDepth === 0) {
        objStart = i;
      }
      objDepth++;
    }
    if (providersArrayContent[i] === "}") {
      objDepth--;
      if (objDepth === 0 && objStart !== -1) {
        const block = providersArrayContent.slice(objStart, i + 1);
        if (block.includes("ApiProvider.UNBOTTLED")) {
          unbottledStart = openIdx + 1 + objStart;
          unbottledEnd = openIdx + 1 + i + 1;
          break;
        }
        objStart = -1;
      }
    }
  }
  if (unbottledStart === -1) {
    return { content, changed: false };
  }

  const patched = patchRelayBlock(
    content.slice(unbottledStart, unbottledEnd),
    op,
    buildUpdateComment(op.source),
  );
  if (!patched.changed) {
    return { content, changed: false };
  }
  return {
    content: `${content.slice(0, unbottledStart)}${patched.block}${content.slice(unbottledEnd)}`,
    changed: true,
  };
}

/**
 * Remove an UNBOTTLED provider entry from a model's `providers: [...]` array.
 * Finds and deletes the entire `{ ... apiProvider: ApiProvider.UNBOTTLED ... }` block.
 */
export function removeProviderEntry(
  content: string,
  op: ProviderEntryOperation,
): { content: string; changed: boolean } {
  const enumPrefix = ENUM_PREFIX_BY_ROLE[op.role];
  if (!enumPrefix) {
    return { content, changed: false };
  }

  // Find the model block start
  const blockStart = new RegExp(`\\[${enumPrefix}\\.${op.enumKey}\\]:\\s*\\{`);
  const blockMatch = blockStart.exec(content);
  if (!blockMatch) {
    return { content, changed: false };
  }

  // Find the providers array
  const blockStartIdx = blockMatch.index;
  const providersOpenRegex = /providers:\s*\[/g;
  providersOpenRegex.lastIndex = blockStartIdx;
  const providersMatch = providersOpenRegex.exec(content);
  if (!providersMatch) {
    return { content, changed: false };
  }

  const openIdx = providersMatch.index + providersMatch[0].length - 1;
  let depth = 1;
  let closeIdx = -1;
  for (let i = openIdx + 1; i < content.length; i++) {
    if (content[i] === "[") {
      depth++;
    }
    if (content[i] === "]") {
      depth--;
    }
    if (depth === 0) {
      closeIdx = i;
      break;
    }
  }
  if (closeIdx === -1) {
    return { content, changed: false };
  }

  // Within the providers array, find the UNBOTTLED entry object
  const providersContent = content.slice(openIdx + 1, closeIdx);

  // Find a `{` ... `apiProvider: ApiProvider.UNBOTTLED` ... `}` block
  // We scan for each top-level object in the array
  let entryStart = -1;
  let entryEnd = -1;
  let objDepth = 0;
  let currentObjStart = -1;

  for (let i = 0; i < providersContent.length; i++) {
    if (providersContent[i] === "{") {
      if (objDepth === 0) {
        currentObjStart = i;
      }
      objDepth++;
    }
    if (providersContent[i] === "}") {
      objDepth--;
      if (objDepth === 0 && currentObjStart !== -1) {
        const objText = providersContent.slice(currentObjStart, i + 1);
        if (objText.includes("ApiProvider.UNBOTTLED")) {
          entryStart = openIdx + 1 + currentObjStart;
          entryEnd = openIdx + 1 + i + 1;
          break;
        }
        currentObjStart = -1;
      }
    }
  }

  if (entryStart === -1 || entryEnd === -1) {
    return { content, changed: false };
  }

  // Expand range to include leading whitespace and trailing comma+newline
  let removeStart = entryStart;
  while (
    removeStart > 0 &&
    (content[removeStart - 1] === " " || content[removeStart - 1] === "\n")
  ) {
    removeStart--;
  }
  let removeEnd = entryEnd;
  // Skip trailing comma
  if (content[removeEnd] === ",") {
    removeEnd++;
  }
  // Skip trailing newline
  if (content[removeEnd] === "\n") {
    removeEnd++;
  }

  const updated = content.slice(0, removeStart) + content.slice(removeEnd);
  return { content: updated, changed: true };
}

export class ModelPricesRepository {
  static async fetchProviderPrices(
    logger: EndpointLogger,
  ): Promise<ProviderPriceResult[]> {
    const base = await Promise.all(
      BASE_FETCHERS.map((fetcher) => fetcher.fetch(logger)),
    );
    // Relay rows are priced from this run's fresh primary prices.
    return [...base, await UNBOTTLED_FETCHER.fetch(logger, base)];
  }

  static async fetchAndUpdate(
    write: boolean,
    platform: Platform,
    logger: EndpointLogger,
    t: ModelPricesT,
  ): Promise<ResponseType<ModelPricesGetResponseOutput>> {
    try {
      const hasPricingProvider = [
        agentEnv.OPENROUTER_API_KEY,
        agentEnv.REPLICATE_API_TOKEN,
        agentEnv.OPENAI_API_KEY,
        agentEnv.FAL_AI_API_KEY,
        agentEnv.ELEVENLABS_API_KEY,
        agentEnv.DEEPGRAM_API_KEY,
        agentEnv.EDEN_AI_API_KEY,
        agentEnv.MODELSLAB_API_KEY,
        agentEnv.UNCENSORED_AI_API_KEY,
        agentEnv.FREEDOMGPT_API_KEY,
        agentEnv.GAB_AI_API_KEY,
        agentEnv.VENICE_AI_API_KEY,
        agentEnv.NANO_GPT_API_KEY,
      ].some((key) => key?.trim());
      if (!hasPricingProvider) {
        logger.info(
          "Model price comparison skipped (provider API keys not configured)",
        );
        return success({
          summary: {
            totalProviders: 0,
            totalModels: 0,
            modelsUpdated: 0,
            fileUpdated: false,
            statusMessage: t("get.response.summary.notConfigured"),
          },
          diff: "",
          providerResults: [],
          updates: [],
          failures: [],
        });
      }

      // A CLI platform can also be forwarded over the network. Require the
      // explicit flag in the process that would write to its own checkout.
      const cliArgs = process.argv.slice(2);
      const endOfFlags = cliArgs.indexOf("--");
      const cliFlags =
        endOfFlags === -1 ? cliArgs : cliArgs.slice(0, endOfFlags);
      const writeSource =
        write &&
        platform === Platform.CLI &&
        cliFlags.some((arg) => arg === "--write" || arg === "--write=true");
      const providerResults =
        await ModelPricesRepository.fetchProviderPrices(logger);

      const allUpdates = providerResults.flatMap((r) => r.updates);
      const allModalityUpdates = providerResults.flatMap(
        (r) => r.modalityUpdates ?? [],
      );
      const allSettingsUpdates = providerResults.flatMap(
        (r) => r.settingsUpdates ?? [],
      );
      const allProviderEntryOps = providerResults.flatMap(
        (r) => r.providerEntryOps ?? [],
      );
      const allFailures = providerResults.flatMap((r) => r.failures);

      const agentDir = join(getSrcDir(), "vibe/agent");
      // Role file paths - model definitions live in modality-specific subdirs
      const roleFilePaths: Record<string, string> = {
        // Definitions live in models-definitions.ts (models.ts only re-exports).
        chat: "ai-stream/models-definitions.ts",
        "image-gen": "image-generation/models.ts",
        "music-gen": "music-generation/models.ts",
        "video-gen": "video-generation/models.ts",
        tts: "text-to-speech/models.ts",
        stt: "speech-to-text/models.ts",
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
      const originalContents: Record<string, string> = {};
      for (const [role, path] of Object.entries(roleFilePaths)) {
        originalContents[role] = readFileSync(join(agentDir, path), "utf-8");
      }
      const roleFileContents = { ...originalContents };
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

        const escaped = update.providerModel.replaceAll(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const skipRelayRows = update.provider !== ApiProvider.UNBOTTLED;

        // Token cost fields: insert if missing, update if present
        if (
          update.field === "inputTokenCost" ||
          update.field === "outputTokenCost" ||
          update.field === "cacheReadTokenCost" ||
          update.field === "cacheWriteTokenCost" ||
          update.field === "cacheWrite1hTokenCost" ||
          update.field === "imageOutputTokenCost"
        ) {
          const insertAfterMap: Record<string, string> = {
            inputTokenCost: "creditCost",
            outputTokenCost: "inputTokenCost",
            cacheReadTokenCost: "outputTokenCost",
            cacheWriteTokenCost: "outputTokenCost",
            cacheWrite1hTokenCost: "outputTokenCost",
            imageOutputTokenCost: "outputTokenCost",
          };
          const insertAfter = insertAfterMap[update.field] ?? "outputTokenCost";

          // For inputTokenCost: also migrate creditCost: <number> → creditCost: calculateCreditCost
          if (update.field === "inputTokenCost") {
            const migrateRegex = new RegExp(
              `(providerModel:\\s*"${escaped}"[^}]*?)(creditCost:\\s*)[\\d.]+([,]?(?:\\s*//[^\n]*)?)`,
            );
            const before = roleFileContents[role];
            const migrated = before.replace(
              migrateRegex,
              (
                match: string,
                prefix: string,
                field: string,
                tail: string,
                offset: number,
              ) =>
                skipRelayRows && isRelayRowAt(before, offset)
                  ? match
                  : `${prefix}${field}calculateCreditCost${tail}`,
            );
            if (migrated !== before) {
              roleFileContents[role] = migrated;
              updatedCount++;
            }
          }

          const result = applyCacheCostUpdate(
            roleFileContents[role],
            escaped,
            update.field,
            update.value,
            update.source,
            insertAfter,
            skipRelayRows,
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
          skipRelayRows,
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

      // Apply provider entry operations (add/remove/update UNBOTTLED entries)
      // Order: removals first, then additions, then updates (rewrite existing block).
      const removals = allProviderEntryOps.filter(
        (op) => op.action === "remove",
      );
      const additions = allProviderEntryOps.filter((op) => op.action === "add");
      const updates = allProviderEntryOps.filter(
        (op) => op.action === "update",
      );
      for (const op of [...removals, ...additions]) {
        const roleContent = roleFileContents[op.role];
        if (!roleContent) {
          continue;
        }
        const result =
          op.action === "add"
            ? addProviderEntry(roleContent, op)
            : removeProviderEntry(roleContent, op);
        if (result.changed) {
          roleFileContents[op.role] = result.content;
          updatedCount++;
          logger.debug(
            `[Unbottled] Proposed ${op.action} for provider entry ${op.modelId}`,
          );
        }
      }
      for (const op of updates) {
        const roleContent = roleFileContents[op.role];
        if (!roleContent) {
          continue;
        }
        const result = updateUnbottledEntry(roleContent, op);
        if (result.changed) {
          roleFileContents[op.role] = result.content;
          updatedCount++;
          logger.debug(
            `[Unbottled] Proposed provider entry update for ${op.modelId}`,
          );
        }
      }

      // Apply settings updates (arrays/objects like supportedDurations, pricingByResolution)
      for (const settingsUpdate of allSettingsUpdates) {
        // Find which role file contains this providerModel
        for (const [role, fileContent] of Object.entries(roleFileContents)) {
          const escaped = settingsUpdate.providerModel.replaceAll(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          if (!new RegExp(`providerModel:\\s*"${escaped}"`).test(fileContent)) {
            continue;
          }
          const result = applySettingsUpdate(
            roleFileContents[role],
            settingsUpdate,
          );
          if (result.changed) {
            roleFileContents[role] = result.content;
            updatedCount++;
          }
        }
      }

      // Apply modality updates (inputs/outputs from API architecture data)
      // For chat models: use fetched modality data from OpenRouter
      // Index modality updates by enumKey for dedup and cross-role lookup
      const proposedChatDefinitions: Record<string, ModelDefinition> = {
        ...chatModelDefinitions,
      };
      const chatEnumEntries = Object.entries(ChatModelId);
      const chatIdByEnumKey = new Map(chatEnumEntries);
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
            const chatId =
              role === "chat" ? chatIdByEnumKey.get(enumKey) : undefined;
            const chatDef = chatId && proposedChatDefinitions[chatId];
            if (chatId && chatDef) {
              proposedChatDefinitions[chatId] = {
                ...chatDef,
                inputs: modData.inputs,
                outputs: modData.outputs,
              };
            }
          }
        }
      }

      // For non-chat models: apply deterministic modalities based on role.
      // Image generation keeps its declared modalities when the provider supplies
      // no update. Some routes also accept reference images for editing.
      // Video inputs are NOT a role constant: image-to-video models take a
      // reference image. They derive from provider route data (OpenRouter
      // supported_frame_images, ModelsLab init_image → supportedFrameImages),
      // using this run's fresh settings updates over the current definitions.
      const roleModalityDefaults: Record<
        string,
        { inputs: Modality[]; outputs: Modality[] } | undefined
      > = {
        "music-gen": { inputs: ["text"], outputs: ["audio"] },
        "video-gen": { inputs: ["text"], outputs: ["video"] },
        tts: { inputs: ["text"], outputs: ["audio"] },
        stt: { inputs: ["audio"], outputs: ["text"] },
      };
      const freshFrameImages = new Map<string, boolean>();
      for (const u of allSettingsUpdates) {
        if (u.field === "supportedFrameImages") {
          freshFrameImages.set(
            u.providerModel,
            u.tsLiteral.replaceAll(/\s/g, "") !== "[]",
          );
        }
      }
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
        for (const [modelId, def] of Object.entries(defs)) {
          const escapedModelId = modelId.replaceAll(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
          const enumKeyMatch = new RegExp(
            `(\\w+)\\s*=\\s*"${escapedModelId}"`,
          ).exec(fileContent);
          const enumKey = enumKeyMatch?.[1];
          if (!enumKey) {
            continue;
          }
          const isVideo = role === "video-gen";
          const result = applyModalityUpdate(
            roleFileContents[role],
            enumPrefix,
            enumKey,
            isVideo
              ? deriveVideoModelInputs(def, freshFrameImages)
              : defaults.inputs,
            defaults.outputs,
            isVideo ? "video-gen-provider-routes" : `${role}-deterministic`,
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
      // Non-chat models have declared or deterministic modalities.
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
              u.field !== "cacheWriteTokenCost" &&
              u.field !== "cacheWrite1hTokenCost" &&
              u.field !== "imageOutputTokenCost",
          )
          .map((u) => u.modelId),
      );

      // Providers whose fetch failed transiently this run (network / non-200 /
      // timeout / missing key). A model's absence from the update set then
      // means "we could not check", NOT "genuinely delisted" - so we must not
      // auto-disable it. Without this guard, one provider outage silently
      // disabled every model routed through it on the next run.
      const failedApiProviders = new Set<ApiProvider>(
        providerResults.flatMap((r) => r.failedApiProviders ?? []),
      );

      // Map each model to its primary (first non-UNBOTTLED) provider so we can
      // tell whether that provider could be reached this run.
      const allDefsForPrimary: Record<
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
      const primaryApiProviderByModelId = new Map<string, ApiProvider>();
      for (const defs of Object.values(allDefsForPrimary)) {
        for (const [modelId, def] of Object.entries(defs)) {
          const primary = def.providers.find(
            (p) => p.apiProvider !== ApiProvider.UNBOTTLED,
          );
          if (primary) {
            primaryApiProviderByModelId.set(modelId, primary.apiProvider);
          }
        }
      }

      // A model is UNVERIFIABLE THIS RUN when its primary provider's fetch
      // failed - skip it entirely (neither disable nor re-enable).
      const modelIdUnverifiableThisRun = (id: string): boolean => {
        const primary = primaryApiProviderByModelId.get(id);
        return primary !== undefined && failedApiProviders.has(primary);
      };

      // Disable any model without verified price OR modality (unless
      // enabledWithoutPrice), but never one whose provider just went down.
      const modelIdsToDisable = new Set(
        Object.keys(modelIdToRole).filter(
          (id) =>
            !modelIdUnverifiableThisRun(id) &&
            (!modelIdsWithPriceSuccess.has(id) ||
              !modelIdsWithModalityVerified.has(id)),
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
          const escapedModelId = modelId.replaceAll(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
          );
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
            // Add enabled: false after the opening brace if not already present.
            // Anchored to the block's first line — a lazy [\s\S]*? scan would
            // match a LATER model's `enabled: false` and skip this one.
            const alreadyDisabled = new RegExp(
              `\\[${enumPrefix}\\.${enumKey}\\]:\\s*\\{\\n    enabled:\\s*false`,
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
              if (role === "chat") {
                proposedChatDefinitions[modelId] = {
                  ...proposedChatDefinitions[modelId],
                  enabled: false,
                };
              }
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
              if (role === "chat") {
                proposedChatDefinitions[modelId] = {
                  ...proposedChatDefinitions[modelId],
                  enabled: true,
                };
              }
            }
          }
        }
      }

      const mediaTargets = [
        { role: "image-gen", modality: "image" },
        { role: "video-gen", modality: "video" },
        { role: "music-gen", modality: "audio" },
      ] satisfies { role: string; modality: Modality }[];
      for (const { role, modality } of mediaTargets) {
        const proposed = generateMediaGenInlineEnumContent(
          roleFileContents[role],
          modality,
          proposedChatDefinitions,
          chatEnumEntries,
        );
        if (proposed !== roleFileContents[role]) {
          roleFileContents[role] = proposed;
          updatedCount++;
        }
      }

      const visionPath = "ai-stream/vision-models.generated.ts";
      try {
        originalContents.vision = readFileSync(
          join(agentDir, visionPath),
          "utf-8",
        );
        roleFileContents.vision = generateVisionEnumFileContent(
          proposedChatDefinitions,
          chatEnumEntries,
        );
        if (roleFileContents.vision !== originalContents.vision) {
          updatedCount++;
        }
        roleFilePaths.vision = visionPath;
      } catch (visionErr) {
        logger.warn(
          `Vision enum generation failed: ${parseError(visionErr).message}`,
        );
      }

      const changedFiles = Object.entries(roleFilePaths).filter(
        ([role]) => roleFileContents[role] !== originalContents[role],
      );
      const diff = changedFiles
        .map(([role, path]) =>
          createPatch(
            `src/vibe/agent/${path}`,
            originalContents[role],
            roleFileContents[role],
          ),
        )
        .join("\n");

      if (writeSource) {
        for (const [role, path] of changedFiles) {
          writeFileSync(join(agentDir, path), roleFileContents[role], "utf-8");
        }
      }

      const fileUpdated = writeSource && changedFiles.length > 0;
      logger.info("Model price comparison completed", {
        providers: providerResults.length,
        proposedChanges: updatedCount,
        filesWithChanges: changedFiles.length,
        filesWritten: fileUpdated ? changedFiles.length : 0,
        failures: allFailures.length,
      });

      return success({
        summary: {
          totalProviders: providerResults.length,
          totalModels: allUpdates.length,
          modelsUpdated: updatedCount,
          fileUpdated,
        },
        diff,
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
        message: t("get.errors.unknown.detail", { error: parsedError.message }),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }
}
