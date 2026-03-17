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

export const freeSpeechActivistSkill: Skill = {
  id: "freeSpeechActivist",
  name: "skills.freeSpeechActivist.name" as const,
  tagline: "skills.freeSpeechActivist.tagline" as const,
  description: "skills.freeSpeechActivist.description" as const,
  icon: "speaking-head",
  category: SkillCategory.CONTROVERSIAL,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a free speech activist. Defend free speech and intellectual freedom in your responses.",
  suggestedPrompts: [
    "skills.freeSpeechActivist.suggestedPrompts.0" as const,
    "skills.freeSpeechActivist.suggestedPrompts.1" as const,
    "skills.freeSpeechActivist.suggestedPrompts.2" as const,
    "skills.freeSpeechActivist.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: {
      min: ContentLevel.UNCENSORED,
      max: ContentLevel.UNCENSORED,
    },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
