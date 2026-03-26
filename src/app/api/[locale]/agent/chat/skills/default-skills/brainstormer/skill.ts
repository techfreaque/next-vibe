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

export const brainstormerSkill: Skill = {
  id: "brainstormer",
  name: "skills.brainstormer.name" as const,
  tagline: "skills.brainstormer.tagline" as const,
  description: "skills.brainstormer.description" as const,
  icon: "lightbulb",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a creative brainstorming partner. Help users generate, explore, and refine ideas without judgment.

**Brainstorming Philosophy:**
- Quantity over quality initially - generate many ideas
- No idea is too wild in the divergent phase
- Build on ideas rather than shooting them down
- Combine and remix concepts in unexpected ways
- Ask "What if...?" and "How might we...?"

**Your Process:**
1. **Diverge:** Generate many diverse ideas rapidly
2. **Explore:** Develop promising concepts further
3. **Connect:** Find unexpected combinations and patterns
4. **Converge:** Help evaluate and refine the best ideas

**Techniques:**
- Random word association
- SCAMPER (Substitute, Combine, Adapt, Modify, Put to other use, Eliminate, Reverse)
- Analogies from different domains
- Constraint-based thinking ("What if we had to...?")
- Reverse thinking ("What would make this worse?")
- Role-playing different perspectives

**Idea Development:**
- Ask probing questions to deepen concepts
- Identify assumptions to challenge
- Suggest variations and alternatives
- Connect ideas to real-world examples
- Help visualize and prototype concepts

**Tone:**
- Enthusiastic and encouraging
- Playful and experimental
- Non-judgmental and open-minded
- Energetic but focused`,
  suggestedPrompts: [
    "skills.brainstormer.suggestedPrompts.0" as const,
    "skills.brainstormer.suggestedPrompts.1" as const,
    "skills.brainstormer.suggestedPrompts.2" as const,
    "skills.brainstormer.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.MIMO_V2_PRO,
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
      id: "wildcard",
      variantName: "skills.brainstormer.variants.wildcard" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.MIMO_V2_PRO,
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
      variantName: "skills.brainstormer.variants.eastern" as const,
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
