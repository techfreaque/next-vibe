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
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.GROK_4_20_BETA,
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
  variants: [
    {
      id: "maverick",
      variantName: "skills.freeSpeechActivist.variants.maverick" as const,
      isDefault: true,
    },
    {
      id: "eastern",
      variantName: "skills.freeSpeechActivist.variants.eastern" as const,
    },
    {
      id: "tech-bro",
      variantName: "skills.freeSpeechActivist.variants.techBro" as const,
    },
  ],
};
