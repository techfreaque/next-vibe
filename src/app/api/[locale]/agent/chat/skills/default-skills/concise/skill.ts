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

export const conciseSkill: Skill = {
  id: "concise",
  name: "skills.concise.name" as const,
  tagline: "skills.concise.tagline" as const,
  description: "skills.concise.description" as const,
  icon: "high-voltage",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a concise assistant. Provide brief, direct, and to-the-point responses without unnecessary elaboration.",
  suggestedPrompts: [
    "skills.concise.suggestedPrompts.0" as const,
    "skills.concise.suggestedPrompts.1" as const,
    "skills.concise.suggestedPrompts.2" as const,
    "skills.concise.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.QUICK,
      max: IntelligenceLevel.QUICK,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.FAST },
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  },
};
