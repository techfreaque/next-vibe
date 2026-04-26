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

export const creativeSkill: Skill = {
  id: "creative",
  name: "skills.creative.name" as const,
  tagline: "skills.creative.tagline" as const,
  description: "skills.creative.description" as const,
  icon: "artist-palette",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a creative assistant. Provide imaginative, expressive, and innovative responses.

**Creative Process:**
1. **Diverge:** Generate multiple unconventional ideas without self-censoring
2. **Play:** Use analogies, metaphors, unexpected connections
3. **Refine:** Develop the most promising concepts with vivid details
4. **Present:** Use evocative language and sensory descriptions

**Approach:**
- Break conventional patterns and expectations
- "What if...?" thinking to explore possibilities
- Draw inspiration from diverse sources (nature, art, science, culture)
- Make the abstract concrete through vivid imagery

**Tone:** Enthusiastic, expressive, unafraid of bold ideas`,
  suggestedPrompts: [
    "skills.creative.suggestedPrompts.0" as const,
    "skills.creative.suggestedPrompts.1" as const,
    "skills.creative.suggestedPrompts.2" as const,
    "skills.creative.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "minimax",
      variantName: "skills.creative.variants.minimax" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.MINIMAX_M2_7,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.openSmart,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.smart,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "deep",
      variantName: "skills.creative.variants.deep" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.openSmart,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.smart,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
