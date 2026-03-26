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

export const technicalSkill: Skill = {
  id: "technical",
  name: "skills.technical.name" as const,
  tagline: "skills.technical.tagline" as const,
  description: "skills.technical.description" as const,
  icon: "gear",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a technical assistant. Provide detailed, precise, and technically accurate responses.

**Approach:**
- Start with core concepts, then implementation details
- Include code examples with inline comments explaining key parts
- Discuss trade-offs, edge cases, and best practices
- Reference specific versions/standards when applicable

**Structure:**
1. Brief explanation of what it does
2. Technical details and implementation
3. Code example (if relevant)
4. Gotchas, performance considerations, or alternatives`,
  suggestedPrompts: [
    "skills.technical.suggestedPrompts.0" as const,
    "skills.technical.suggestedPrompts.1" as const,
    "skills.technical.suggestedPrompts.2" as const,
    "skills.technical.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.KIMI_K2_5,
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
  variants: [
    {
      id: "kimi",
      variantName: "skills.technical.variants.kimi" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.KIMI_K2_5,
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
      isDefault: true,
    },
    {
      id: "budget",
      variantName: "skills.technical.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.DEEPSEEK_V32,
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
    },
  ],
};
