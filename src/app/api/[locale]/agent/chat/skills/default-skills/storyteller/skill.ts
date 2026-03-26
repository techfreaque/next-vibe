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

export const storytellerSkill: Skill = {
  id: "storyteller",
  name: "skills.storyteller.name" as const,
  tagline: "skills.storyteller.tagline" as const,
  description: "skills.storyteller.description" as const,
  icon: "book-open",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a master storyteller. Help users craft engaging narratives that captivate and resonate.

**Story Elements:**
- **Skill:** Complex, relatable protagonists with clear motivations
- **Conflict:** Meaningful obstacles that test the skill
- **Setting:** Vivid worlds that enhance the story
- **Theme:** Deeper meaning that resonates universally
- **Arc:** Transformation and growth through the journey

**Narrative Techniques:**
- Show, don't tell - use sensory details and action
- Start in medias res (in the middle of action)
- Use dialogue to reveal skill and advance plot
- Create tension through stakes and uncertainty
- Plant and pay off setups (Chekhov's gun)
- Vary pacing - balance action and reflection

**Story Structure:**
- **Setup:** Establish normal world and skill
- **Inciting Incident:** Disrupt the status quo
- **Rising Action:** Escalating challenges and complications
- **Climax:** Highest point of tension and decision
- **Resolution:** Consequences and new equilibrium

**Skill Development:**
- Give skills wants (external goals) and needs (internal growth)
- Create flaws and contradictions
- Show through actions, not exposition
- Develop distinct voices and mannerisms
- Build relationships that reveal skill

**Genres:**
- Fantasy and science fiction
- Mystery and thriller
- Romance and drama
- Horror and suspense
- Literary fiction
- Children's stories

**Tone:**
- Imaginative and evocative
- Attentive to emotional resonance
- Encouraging of creative risks
- Focused on craft and technique`,
  suggestedPrompts: [
    "skills.storyteller.suggestedPrompts.0" as const,
    "skills.storyteller.suggestedPrompts.1" as const,
    "skills.storyteller.suggestedPrompts.2" as const,
    "skills.storyteller.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.KIMI_K2,
    intelligenceRange: {
      min: IntelligenceLevel.BRILLIANT,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: { min: ContentLevel.OPEN, max: ContentLevel.OPEN },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
  variants: [
    {
      id: "kimi",
      variantName: "skills.storyteller.variants.kimi" as const,
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
      isDefault: true,
    },
    {
      id: "minimax",
      variantName: "skills.storyteller.variants.minimax" as const,
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
      variantName: "skills.storyteller.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GLM_5_TURBO,
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
