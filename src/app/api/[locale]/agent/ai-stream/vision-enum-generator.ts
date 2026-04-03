/**
 * Vision Model Enum Generator
 *
 * Shared utility used by both:
 * - Price updater (after updating modalities in source files)
 * - `vibe gen` (for immediate dev use)
 *
 * Generates vision-models.generated.ts with enums for each input modality:
 * - ImageVisionModelId: chat models accepting "image" input
 * - VideoVisionModelId: chat models accepting "video" input
 * - AudioVisionModelId: chat models accepting "audio" input
 */

import type { Modality } from "../models/enum";
import type { ModelDefinition } from "../models/models";

interface EnumEntry {
  key: string;
  value: string;
}

function buildEnumBlock(name: string, entries: EnumEntry[]): string {
  if (entries.length === 0) {
    return `export enum ${name} {}\n`;
  }
  const lines = entries.map((e) => `  ${e.key} = "${e.value}",`);
  return `export enum ${name} {\n${lines.join("\n")}\n}\n`;
}

/**
 * Generate the content of vision-models.generated.ts from chat model definitions.
 *
 * @param chatDefs - Record of model ID → ModelDefinition (from chatModelDefinitions)
 * @param chatEnumEntries - Array of [ENUM_KEY, "model-id"] from Object.entries(ChatModelId)
 */
export function generateVisionEnumFileContent(
  chatDefs: Record<string, ModelDefinition>,
  chatEnumEntries: Array<[string, string]>,
): string {
  const imageEntries: EnumEntry[] = [];
  const videoEntries: EnumEntry[] = [];
  const audioEntries: EnumEntry[] = [];

  for (const [key, value] of chatEnumEntries) {
    const def = chatDefs[value];
    if (!def) {
      continue;
    }

    // Skip disabled models
    if (def.enabled === false) {
      continue;
    }

    const inputs: Modality[] = def.inputs;

    if (inputs.includes("image")) {
      imageEntries.push({ key, value });
    }
    if (inputs.includes("video")) {
      videoEntries.push({ key, value });
    }
    if (inputs.includes("audio")) {
      audioEntries.push({ key, value });
    }
  }

  const header = `/**
 * AUTO-GENERATED — do not edit manually.
 * Source: chatModelDefinitions inputs field.
 * Re-run: vibe update-all-model-prices or vibe gen
 */

`;

  return [
    header,
    buildEnumBlock("ImageVisionModelId", imageEntries),
    "\n",
    buildEnumBlock("VideoVisionModelId", videoEntries),
    "\n",
    buildEnumBlock("AudioVisionModelId", audioEntries),
  ].join("");
}
