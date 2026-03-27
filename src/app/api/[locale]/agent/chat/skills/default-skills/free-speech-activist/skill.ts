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
  variants: [
    {
      id: "maverick",
      variantName: "skills.freeSpeechActivist.variants.maverick" as const,
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
      isDefault: true,
    },
    {
      id: "eastern",
      variantName: "skills.freeSpeechActivist.variants.eastern" as const,
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
    },
    {
      id: "tech-bro",
      variantName: "skills.freeSpeechActivist.variants.techBro" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.CLAUDE_SONNET_4_6,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
    },
  ],
};
