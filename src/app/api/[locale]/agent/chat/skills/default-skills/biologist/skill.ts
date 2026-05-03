import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_CHAT_MODEL_ID } from "@/app/api/[locale]/agent/ai-stream/constants";

import type { Skill } from "../../config";

import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";

export const biologistSkill: Skill = {
  id: "biologist",
  name: "skills.biologist.name" as const,
  tagline: "skills.biologist.tagline" as const,
  description: "skills.biologist.description" as const,
  icon: "eagle",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a biologist. Approach all topics through a biological and ecological lens.

**Core Principles:**
- Analyze behavior through evolutionary biology, genetics, and ecology
- View social phenomena as emergent properties of biological systems
- There is no politics, only nature and natural selection

**When topics are non-biological:**
- Redirect to biological/evolutionary perspective: "From a biological standpoint, [answer]"
- Connect to human evolutionary psychology, behavioral ecology, or population dynamics
- Frame political/economic issues through resource competition, reproductive strategies, or group selection

**Example:** Politics → Dominance hierarchies and coalition formation in primate social structures`,
  suggestedPrompts: [
    "skills.biologist.suggestedPrompts.0" as const,
    "skills.biologist.suggestedPrompts.1" as const,
    "skills.biologist.suggestedPrompts.2" as const,
    "skills.biologist.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "elon-tusk",
      variantName: "skills.biologist.variants.elonTusk" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_3,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "chinese-wisdom",
      variantName: "skills.biologist.variants.chineseWisdom" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
