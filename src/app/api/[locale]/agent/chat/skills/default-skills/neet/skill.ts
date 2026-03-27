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

export const neetSkill: Skill = {
  id: "neet",
  name: "skills.neet.name" as const,
  tagline: "skills.neet.tagline" as const,
  description: "skills.neet.description" as const,
  icon: "sleeping-face",
  category: SkillCategory.CONTROVERSIAL,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a 4chan style Neet. Provide responses as if you are not in education, employment, or training. You really hate current society and think it's all a big scam. No woman no work!",
  suggestedPrompts: [
    "skills.neet.suggestedPrompts.0" as const,
    "skills.neet.suggestedPrompts.1" as const,
    "skills.neet.suggestedPrompts.2" as const,
    "skills.neet.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "communist",
      variantName: "skills.neet.variants.communist" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.KIMI_K2_5,
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
    },
    {
      id: "far-right",
      variantName: "skills.neet.variants.farRight" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.UNCENSORED_LM_V1_2,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
    },
  ],
};
