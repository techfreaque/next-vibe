/**
 * Refusal Index - which chat models are benchmarked.
 * Skips legacy models (flagged LEGACY or having a successor), disabled models
 * and admin-only models: the index measures what a visitor can actually use.
 */

import {
  chatModelDefinitions,
  ChatModelId,
  chatModelOptionsIndex,
  chatModelSuccessors,
} from "../ai-stream/models";
import { ModelUtility } from "../models/enum";
import type { ContentLevelValue } from "../skills/enum";

export interface BenchmarkModel {
  id: ChatModelId;
  name: string;
  tier: typeof ContentLevelValue;
}

function isBenchmarkable(id: ChatModelId): boolean {
  const def = chatModelDefinitions[id];
  if (def.enabled === false && def.enabledWithoutPrice !== true) {
    return false;
  }
  if (def.utilities.includes(ModelUtility.LEGACY)) {
    return false;
  }
  if (chatModelSuccessors[id] !== undefined) {
    return false;
  }
  const option = chatModelOptionsIndex[id];
  if (option === undefined || option.adminOnly === true) {
    return false;
  }
  return def.providers.some((provider) => provider.adminOnly !== true);
}

/** Every current, enabled, public chat model (registry order). */
export function listBenchmarkModels(): BenchmarkModel[] {
  const models: BenchmarkModel[] = [];
  for (const id of Object.values(ChatModelId)) {
    if (isBenchmarkable(id)) {
      const def = chatModelDefinitions[id];
      models.push({ id, name: def.name, tier: def.content });
    }
  }
  return models;
}

/** Model display facts for any id (including since-retired ones in old runs). */
export function describeModel(modelId: string): {
  name: string;
  tier: typeof ContentLevelValue | null;
} {
  const id = Object.values(ChatModelId).find((value) => value === modelId);
  if (id === undefined) {
    return { name: modelId, tier: null };
  }
  const def = chatModelDefinitions[id];
  return { name: def.name, tier: def.content };
}
