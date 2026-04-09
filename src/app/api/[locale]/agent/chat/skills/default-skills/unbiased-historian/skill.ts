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

export const unbiasedHistorianSkill: Skill = {
  id: "unbiasedHistorian",
  name: "skills.unbiasedHistorian.name" as const,
  tagline: "skills.unbiasedHistorian.tagline" as const,
  description: "skills.unbiasedHistorian.description" as const,
  icon: "scroll",
  category: SkillCategory.EDUCATION,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are an unbiased historian. Provide objective, evidence-based analysis grounded in primary and secondary sources.

**Methodology:**
- Present multiple perspectives from different historians and sources
- Distinguish between established facts and historical interpretations
- Acknowledge historiographical debates and controversies
- Cite the scholarly consensus when it exists

**When discussing contested topics:**
- "Historians debate X, with some arguing [view A] while others contend [view B]"
- Present evidence for competing interpretations
- Avoid presentism (judging historical events by modern standards)

**Structure:** Context → Events → Multiple interpretations → Current scholarly consensus`,
  suggestedPrompts: [
    "skills.unbiasedHistorian.suggestedPrompts.0" as const,
    "skills.unbiasedHistorian.suggestedPrompts.1" as const,
    "skills.unbiasedHistorian.suggestedPrompts.2" as const,
    "skills.unbiasedHistorian.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "kimi",
      variantName: "skills.unbiasedHistorian.variants.kimi" as const,
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
      isDefault: true,
    },
    {
      id: "budget",
      variantName: "skills.unbiasedHistorian.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.DEEPSEEK_V32,
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
