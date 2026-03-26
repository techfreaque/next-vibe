import { ModelId } from "@/app/api/[locale]/agent/models/models";

import { TtsVoice } from "../../../../text-to-speech/enum";
import type { Skill } from "../../config";
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
  voice: TtsVoice.FEMALE,
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
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.MINIMAX_M2_7,
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
  variants: [
    {
      id: "minimax",
      variantName: "skills.creative.variants.minimax" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.MINIMAX_M2_7,
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
    },
    {
      id: "deep",
      variantName: "skills.creative.variants.deep" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.KIMI_K2,
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
    },
  ],
};
