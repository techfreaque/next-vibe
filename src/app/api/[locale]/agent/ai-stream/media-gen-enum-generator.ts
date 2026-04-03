/**
 * Media-Gen Model Enum Generator
 *
 * Shared utility used by both:
 * - Price updater (after updating modalities in source files)
 * - `vibe gen` (for immediate dev use)
 *
 * Scans chat model definitions for output modalities and splices
 * auto-generated enum entries into the media-gen model files using
 * marker comments. Only generates enum entries — model option objects
 * are built at runtime by merging chatModelOptions into the media-gen
 * options list.
 *
 * Pattern mirrors vision-enum-generator.ts but operates on outputs
 * instead of inputs.
 */

import { readFileSync, writeFileSync } from "node:fs";

import type { Modality } from "../models/enum";
import type { ModelDefinition } from "../models/models";

interface EnumEntry {
  key: string;
  value: string;
}

const ENUM_START_MARKER =
  "  // --- AUTO-GENERATED from chat models with matching output modality ---";
const ENUM_END_MARKER = "  // --- END AUTO-GENERATED ---";

/**
 * Build enum entries for chat models that output a given modality.
 */
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
    const outputs: Modality[] = def.outputs;
    if (outputs.includes(modality)) {
      entries.push({ key, value });
    }
  }
  return entries;
}

/**
 * Splice auto-generated content between marker comments in a file.
 * Returns the updated file content, or null if markers are missing.
 */
function spliceMarkers(
  content: string,
  startMarker: string,
  endMarker: string,
  replacement: string,
): string | null {
  const startIdx = content.indexOf(startMarker);
  const endIdx = content.indexOf(endMarker);
  if (startIdx === -1 || endIdx === -1) {
    return null;
  }
  const before = content.slice(0, startIdx + startMarker.length);
  const after = content.slice(endIdx);
  return `${before}\n${replacement}${after}`;
}

export interface MediaGenEnumUpdate {
  filePath: string;
  modality: Modality;
}

/**
 * Update a media-gen model file's enum with auto-generated entries from chat models.
 *
 * The file must contain ENUM_START_MARKER and ENUM_END_MARKER comments.
 * Returns true if the file was modified.
 */
export function updateMediaGenEnumFile(
  update: MediaGenEnumUpdate,
  chatDefs: Record<string, ModelDefinition>,
  chatEnumEntries: Array<[string, string]>,
  logger?: { info: (msg: string) => void; warn: (msg: string) => void },
): boolean {
  const entries = collectEntriesForModality(
    update.modality,
    chatDefs,
    chatEnumEntries,
  );

  const original = readFileSync(update.filePath, "utf-8");
  const enumLines =
    entries.length > 0
      ? `${entries.map((e) => `  ${e.key} = "${e.value}",`).join("\n")}\n`
      : "";

  const result = spliceMarkers(
    original,
    ENUM_START_MARKER,
    ENUM_END_MARKER,
    enumLines,
  );
  if (!result) {
    logger?.warn(`Missing enum markers in ${update.filePath} — skipping`);
    return false;
  }

  if (result !== original) {
    writeFileSync(update.filePath, result, "utf-8");
    logger?.info(
      `Media-gen enum regenerated in ${update.filePath} (${entries.length} chat model entries)`,
    );
    return true;
  }
  return false;
}
