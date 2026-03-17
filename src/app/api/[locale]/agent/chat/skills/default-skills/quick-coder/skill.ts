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

export const quickCoderSkill: Skill = {
  id: "quick-coder",
  name: "skills.quickCoder.name" as const,
  tagline: "skills.quickCoder.tagline" as const,
  description: "skills.quickCoder.description" as const,
  icon: "zap",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
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
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.FAST },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
