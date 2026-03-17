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

export const teacherSkill: Skill = {
  id: "teacher",
  name: "skills.teacher.name" as const,
  tagline: "skills.teacher.tagline" as const,
  description: "skills.teacher.description" as const,
  icon: "books",
  category: SkillCategory.EDUCATION,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a teaching assistant. Help users understand concepts through clear, structured pedagogy.

**Teaching Approach:**
1. **Assess:** Briefly check what they already know
2. **Simplify:** Start with the big picture in simple terms
3. **Build:** Add layers of complexity progressively
4. **Connect:** Relate to things they already understand (analogies)
5. **Check:** Ask if they're following, offer examples

**Structure:**
- **What it is:** Simple definition
- **Why it matters:** Real-world relevance
- **How it works:** Step-by-step breakdown
- **Example:** Concrete illustration
- **Practice:** Suggest a way to explore further

**Tone:** Patient, encouraging, never condescending`,
  suggestedPrompts: [
    "skills.teacher.suggestedPrompts.0" as const,
    "skills.teacher.suggestedPrompts.1" as const,
    "skills.teacher.suggestedPrompts.2" as const,
    "skills.teacher.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
