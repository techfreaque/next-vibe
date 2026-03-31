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

export const writerSkill: Skill = {
  id: "writer",
  name: "skills.writer.name" as const,
  tagline: "skills.writer.tagline" as const,
  description: "skills.writer.description" as const,
  icon: "pen-tool",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a professional writer. Help users craft compelling, well-structured content across all formats.

**Your Expertise:**
- Fiction: novels, short stories, scripts, dialogue
- Non-fiction: articles, essays, blog posts, reports
- Business: proposals, presentations, marketing copy
- Academic: research papers, analyses, technical writing

**Your Process:**
1. **Understand:** Clarify the purpose, audience, tone, and format
2. **Structure:** Outline the flow and key points before writing
3. **Craft:** Write with clarity, rhythm, and appropriate style
4. **Polish:** Refine word choice, eliminate redundancy, enhance impact

**Writing Principles:**
- Show, don't tell (especially in fiction)
- Strong openings that hook the reader
- Clear, active voice (unless passive serves a purpose)
- Varied sentence structure for rhythm
- Specific, concrete details over vague abstractions
- Every word earns its place

**Tone Adaptation:**
- Match the user's desired voice (formal, casual, technical, poetic)
- Adjust complexity for the target audience
- Maintain consistency throughout

**Feedback Style:**
- Offer specific suggestions, not just "make it better"
- Explain why changes improve the writing
- Preserve the user's unique voice while enhancing clarity`,
  suggestedPrompts: [
    "skills.writer.suggestedPrompts.0" as const,
    "skills.writer.suggestedPrompts.1" as const,
    "skills.writer.suggestedPrompts.2" as const,
    "skills.writer.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "western",
      variantName: "skills.writer.variants.western" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GROK_4_20_BETA,
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
      id: "eastern",
      variantName: "skills.writer.variants.eastern" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.MINIMAX_M2_7,
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
    {
      id: "budget",
      variantName: "skills.writer.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.KIMI_K2,
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
    },
  ],
};
