/**
 * Media-Gen Inline Enum Generator
 *
 * Splices LLM-derived model IDs into the `// BEGIN:llm-generated` / `// END:llm-generated`
 * markers inside ImageGenModelId, VideoGenModelId, and MusicGenModelId enums.
 *
 * Called by the price updater after updating chat model output modalities.
 * Models with outputs containing "image" → ImageGenModelId
 * Models with outputs containing "video" → VideoGenModelId
 * Models with outputs containing "audio" → MusicGenModelId
 */

import { readFileSync, writeFileSync } from "node:fs";

import type { Modality } from "../models/enum";
import type { ModelDefinition } from "../models/models";

const BEGIN_MARKER =
  "  // BEGIN:llm-generated — do not edit manually, updated by price updater";
const END_MARKER = "  // END:llm-generated";

interface EnumEntry {
  key: string;
  value: string;
}

function collectEntriesForModality(
  modality: Modality,
  chatDefs: Record<string, ModelDefinition>,
  chatEnumEntries: Array<[string, string]>,
): EnumEntry[] {
  const entries: EnumEntry[] = [];
  for (const [key, value] of chatEnumEntries) {
    const def = chatDefs[value];
    if (!def || def.enabled === false) {
      continue;
    }
    if (def.outputs.includes(modality)) {
      entries.push({ key, value });
    }
  }
  return entries;
}

function spliceEnumEntries(source: string, entries: EnumEntry[]): string {
  const beginIdx = source.indexOf(BEGIN_MARKER);
  const endIdx = source.indexOf(END_MARKER);
  if (beginIdx === -1 || endIdx === -1) {
    // Return source unchanged — caller handles missing markers gracefully
    return source;
  }
  const before = source.slice(0, beginIdx + BEGIN_MARKER.length);
  const after = source.slice(endIdx);
  const lines = entries.map((e) => `  ${e.key} = "${e.value}",`);
  const middle = lines.length > 0 ? `\n${lines.join("\n")}\n` : "\n";
  return before + middle + after;
}

/**
 * Update the llm-generated section of a media-gen enum file.
 * Returns true if the file was modified.
 */
export function updateMediaGenInlineEnum(
  filePath: string,
  modality: Modality,
  chatDefs: Record<string, ModelDefinition>,
  chatEnumEntries: Array<[string, string]>,
  logger?: { info: (msg: string) => void; warn: (msg: string) => void },
): boolean {
  const entries = collectEntriesForModality(
    modality,
    chatDefs,
    chatEnumEntries,
  );
  const existing = readFileSync(filePath, "utf-8");
  const updated = spliceEnumEntries(existing, entries);
  if (updated === existing) {
    return false;
  }
  writeFileSync(filePath, updated, "utf-8");
  logger?.info(`Media-gen ${modality} enum updated in ${filePath}`);
  return true;
}
