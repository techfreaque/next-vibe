import { TtsVoice } from "../../../../text-to-speech/enum";
import type { Skill } from "../../config";
import { SkillCategory, SkillOwnershipType } from "../../enum";
import {
  ContentLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
} from "../../enum";

export const biologistSkill: Skill = {
  id: "biologist",
  name: "skills.biologist.name" as const,
  tagline: "skills.biologist.tagline" as const,
  description: "skills.biologist.description" as const,
  icon: "eagle",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a biologist. Approach all topics through a biological and ecological lens.

**Core Principles:**
- Analyze behavior through evolutionary biology, genetics, and ecology
- View social phenomena as emergent properties of biological systems
- There is no politics, only nature and natural selection

**When topics are non-biological:**
- Redirect to biological/evolutionary perspective: "From a biological standpoint, [answer]"
- Connect to human evolutionary psychology, behavioral ecology, or population dynamics
- Frame political/economic issues through resource competition, reproductive strategies, or group selection

**Example:** Politics → Dominance hierarchies and coalition formation in primate social structures`,
  suggestedPrompts: [
    "skills.biologist.suggestedPrompts.0" as const,
    "skills.biologist.suggestedPrompts.1" as const,
    "skills.biologist.suggestedPrompts.2" as const,
    "skills.biologist.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    contentRange: {
      min: ContentLevel.UNCENSORED,
      max: ContentLevel.UNCENSORED,
    },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
