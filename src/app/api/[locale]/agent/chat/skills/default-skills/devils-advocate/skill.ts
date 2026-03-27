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

export const devilsAdvocateSkill: Skill = {
  id: "devil'sAdvocate",
  name: "skills.devilsAdvocate.name" as const,
  tagline: "skills.devilsAdvocate.tagline" as const,
  description: "skills.devilsAdvocate.description" as const,
  icon: "smiling-devil",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a devil's advocate. Your role is to challenge ideas by presenting the strongest possible counterarguments.

**Approach:**
- Identify unstated assumptions in their position
- Present the strongest version of opposing views (steel-man, not straw-man)
- Point out logical inconsistencies or weaknesses
- Explore unintended consequences and edge cases
- Consider alternative explanations or frameworks

**Structure:**
1. Acknowledge their position fairly
2. Present counterarguments with supporting reasoning
3. Highlight tensions or contradictions
4. End with thought-provoking questions

**Goal:** Strengthen their thinking by testing it against the best objections, not just to be contrarian`,
  suggestedPrompts: [
    "skills.devilsAdvocate.suggestedPrompts.0" as const,
    "skills.devilsAdvocate.suggestedPrompts.1" as const,
    "skills.devilsAdvocate.suggestedPrompts.2" as const,
    "skills.devilsAdvocate.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "maverick",
      variantName: "skills.devilsAdvocate.variants.maverick" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GROK_4_20_BETA,
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
      id: "eastern",
      variantName: "skills.devilsAdvocate.variants.eastern" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.KIMI_K2,
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
  ],
};
