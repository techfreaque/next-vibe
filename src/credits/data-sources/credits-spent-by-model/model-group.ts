/**
 * Maps a usage debit (credit_transactions.model_id + feature) to its
 * ModelSpendGroup. Server-only: reads the model registry.
 *
 * - model_id of a chat model: grouped by the model maker (definition `by`);
 * - model_id of an image / video / music / voice model: that modality;
 * - model_id of a billable tool service (Brave, Kagi, Scrappey): TOOLS;
 * - no or unknown model_id: the feature decides (legacy rows stored
 *   localized labels, folded by normalizeCreditFeature);
 * - neither: UNATTRIBUTED.
 */

import "server-only";

import { IMAGE_GEN_ALIAS } from "next-vibe/agent/image-generation/constants";
import { MUSIC_GEN_ALIAS } from "next-vibe/agent/music-generation/constants";
import { VIDEO_GEN_ALIAS } from "next-vibe/agent/video-generation/constants";

import { chatModelDefinitions } from "@/vibe/agent/ai-stream/models-definitions";
import { imageGenModelDefinitions } from "@/vibe/agent/image-generation/models";
import type { ModelDefinition } from "@/vibe/agent/models/models";
import { musicGenModelDefinitions } from "@/vibe/agent/music-generation/models";
import { sttModelDefinitions } from "@/vibe/agent/speech-to-text/models";
import { ttsModelDefinitions } from "@/vibe/agent/text-to-speech/models";
import { videoGenModelDefinitions } from "@/vibe/agent/video-generation/models";

import { CreditFeature } from "../../enum";
import { normalizeCreditFeature } from "../../feature-label";
import { TOOL_COST_PROVIDERS } from "../../tool-cost-providers";
import { ModelSpendGroup, type ModelSpendGroupValue } from "./enum";

type Group = typeof ModelSpendGroupValue;

const CHAT_MAKER_GROUPS: Readonly<Record<string, Group>> = {
  uncensoredAI: ModelSpendGroup.UNCENSORED_AI,
  zAi: ModelSpendGroup.ZAI,
  moonshotAI: ModelSpendGroup.MOONSHOT,
  deepSeek: ModelSpendGroup.DEEPSEEK,
  veniceAI: ModelSpendGroup.VENICE,
  xAI: ModelSpendGroup.XAI,
  anthropic: ModelSpendGroup.ANTHROPIC,
  openAI: ModelSpendGroup.OPENAI,
  google: ModelSpendGroup.GOOGLE,
};

const FEATURE_GROUPS: Readonly<Record<string, Group>> = {
  [IMAGE_GEN_ALIAS]: ModelSpendGroup.IMAGE,
  [VIDEO_GEN_ALIAS]: ModelSpendGroup.VIDEO,
  [MUSIC_GEN_ALIAS]: ModelSpendGroup.MUSIC,
  [CreditFeature.TEXT_TO_SPEECH]: ModelSpendGroup.VOICE,
  [CreditFeature.SPEECH_TO_TEXT]: ModelSpendGroup.VOICE,
};

function buildModelGroups(): ReadonlyMap<string, Group> {
  const map = new Map<string, Group>();
  const add = (
    defs: Readonly<Record<string, ModelDefinition>>,
    groupOf: (def: ModelDefinition) => Group,
  ): void => {
    for (const [id, def] of Object.entries(defs)) {
      const group = groupOf(def);
      map.set(id, group);
      for (const provider of def.providers) {
        if (!map.has(provider.id)) {
          map.set(provider.id, group);
        }
      }
    }
  };
  add(
    chatModelDefinitions,
    (def) => CHAT_MAKER_GROUPS[def.by] ?? ModelSpendGroup.OTHER_CHAT,
  );
  add(imageGenModelDefinitions, () => ModelSpendGroup.IMAGE);
  add(videoGenModelDefinitions, () => ModelSpendGroup.VIDEO);
  add(musicGenModelDefinitions, () => ModelSpendGroup.MUSIC);
  add(ttsModelDefinitions, () => ModelSpendGroup.VOICE);
  add(sttModelDefinitions, () => ModelSpendGroup.VOICE);
  for (const tool of Object.values(TOOL_COST_PROVIDERS)) {
    map.set(tool.modelId, ModelSpendGroup.TOOLS);
  }
  return map;
}

let modelGroups: ReadonlyMap<string, Group> | undefined;

export function modelSpendGroup(
  modelId: string | null,
  feature: string | null,
): Group {
  modelGroups ??= buildModelGroups();
  const byModel = modelId ? modelGroups.get(modelId) : undefined;
  if (byModel) {
    return byModel;
  }
  if (feature) {
    return (
      FEATURE_GROUPS[normalizeCreditFeature(feature)] ?? ModelSpendGroup.TOOLS
    );
  }
  return modelId ? ModelSpendGroup.OTHER_CHAT : ModelSpendGroup.UNATTRIBUTED;
}
