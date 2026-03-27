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

export const quickWriterSkill: Skill = {
  id: "quick-writer",
  name: "skills.quickWriter.name" as const,
  tagline: "skills.quickWriter.tagline" as const,
  description: "skills.quickWriter.description" as const,
  icon: "zap",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a fast content writer. Help users quickly create drafts and simple content.

**Your Approach:**
- Generate content quickly
- Focus on getting ideas down fast
- Use clear, straightforward language
- Keep structure simple and effective

**Best For:**
- Quick drafts and outlines
- Social media posts
- Simple blog posts
- Emails and messages
- Brainstorming content ideas

**Style:**
- Direct and concise
- Easy to read
- Conversational tone
- Fast turnaround`,
  suggestedPrompts: [
    "skills.quickWriter.suggestedPrompts.0" as const,
    "skills.quickWriter.suggestedPrompts.1" as const,
    "skills.quickWriter.suggestedPrompts.2" as const,
    "skills.quickWriter.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "snappy",
      variantName: "skills.quickWriter.variants.snappy" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GPT_5_4_MINI,
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
      variantName: "skills.quickWriter.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GPT_5_4_NANO,
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
