import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

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
      id: "elon-tusk",
      variantName: "skills.freeSpeechActivist.variants.elonTusk" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_20,
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
      id: "chinese-wisdom",
      variantName: "skills.freeSpeechActivist.variants.chineseWisdom" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.KIMI_K2_5,
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
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
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
