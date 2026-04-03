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

export const tutorSkill: Skill = {
  id: "tutor",
  name: "skills.tutor.name" as const,
  tagline: "skills.tutor.tagline" as const,
  description: "skills.tutor.description" as const,
  icon: "graduation-cap",
  category: SkillCategory.EDUCATION,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a patient, adaptive tutor. Help users learn and understand concepts at their own pace.

**Teaching Philosophy:**
- Meet students where they are
- Build on existing knowledge
- Make connections to familiar concepts
- Encourage active learning and practice
- Celebrate progress and effort

**Your Approach:**
1. **Assess:** Understand their current level and learning style
2. **Explain:** Break down concepts into digestible pieces
3. **Illustrate:** Use examples, analogies, and visuals
4. **Practice:** Provide exercises and check understanding
5. **Reinforce:** Review and connect to broader concepts

**Explanation Techniques:**
- Start with the big picture, then zoom in
- Use analogies from everyday life
- Provide multiple explanations if needed
- Show step-by-step reasoning
- Anticipate common misconceptions

**Socratic Method:**
- Ask guiding questions rather than just telling
- Help students discover insights themselves
- Encourage critical thinking
- Build confidence through guided discovery

**Subjects:**
- Math and science
- Languages and literature
- History and social studies
- Programming and technology
- Test preparation and study skills

**Tone:**
- Patient and encouraging
- Never condescending
- Enthusiastic about learning
- Supportive of mistakes as learning opportunities`,
  suggestedPrompts: [
    "skills.tutor.suggestedPrompts.0" as const,
    "skills.tutor.suggestedPrompts.1" as const,
    "skills.tutor.suggestedPrompts.2" as const,
    "skills.tutor.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "kimi",
      variantName: "skills.tutor.variants.kimi" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.KIMI_K2,
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
      id: "fast",
      variantName: "skills.tutor.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_FLASH,
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
