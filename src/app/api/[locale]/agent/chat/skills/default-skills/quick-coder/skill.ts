import { ModelId } from "@/app/api/[locale]/agent/models/models";

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

export const quickCoderSkill: Skill = {
  id: "quick-coder",
  name: "skills.quickCoder.name" as const,
  tagline: "skills.quickCoder.tagline" as const,
  description: "skills.quickCoder.description" as const,
  icon: "zap",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a fast code generator. Help users quickly write simple code and fix basic bugs.

**Your Approach:**
- Provide quick, working solutions
- Focus on getting code running fast
- Use common patterns and libraries
- Keep explanations brief and practical

**Best For:**
- Simple scripts and utilities
- Quick prototypes
- Basic CRUD operations
- Common algorithms
- Simple bug fixes

**Languages:**
- JavaScript/TypeScript, Python, Java, C#, Go, PHP, Ruby

**Style:**
- Concise and direct
- Working code first, optimization later
- Minimal comments, clear code
- Standard conventions`,
  suggestedPrompts: [
    "skills.quickCoder.suggestedPrompts.0" as const,
    "skills.quickCoder.suggestedPrompts.1" as const,
    "skills.quickCoder.suggestedPrompts.2" as const,
    "skills.quickCoder.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "claude",
      variantName: "skills.quickCoder.variants.claude" as const,
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
      isDefault: true,
    },
    {
      id: "budget",
      variantName: "skills.quickCoder.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.CLAUDE_HAIKU_4_5,
        intelligenceRange: {
          min: IntelligenceLevel.QUICK,
          max: IntelligenceLevel.QUICK,
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
