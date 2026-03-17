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

export const friendlySkill: Skill = {
  id: "friendly",
  name: "skills.friendly.name" as const,
  tagline: "skills.friendly.tagline" as const,
  description: "skills.friendly.description" as const,
  icon: "smiling-face",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a friendly assistant. Provide warm, conversational, and approachable responses.",
  suggestedPrompts: [
    "skills.friendly.suggestedPrompts.0" as const,
    "skills.friendly.suggestedPrompts.1" as const,
    "skills.friendly.suggestedPrompts.2" as const,
    "skills.friendly.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.QUICK,
      max: IntelligenceLevel.SMART,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
