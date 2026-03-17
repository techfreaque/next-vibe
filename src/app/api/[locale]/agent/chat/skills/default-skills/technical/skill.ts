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
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.BRILLIANT,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: { min: ContentLevel.MAINSTREAM, max: ContentLevel.OPEN },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
