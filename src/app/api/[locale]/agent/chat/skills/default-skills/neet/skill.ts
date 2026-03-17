import { TtsVoice } from "../../../../text-to-speech/enum";
import type { Skill } from "../../config";
import { SkillCategory, SkillOwnershipType } from "../../enum";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SpeedLevel,
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
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.QUICK,
      max: IntelligenceLevel.SMART,
    },
    contentRange: {
      min: ContentLevel.UNCENSORED,
      max: ContentLevel.UNCENSORED,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
