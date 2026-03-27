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

export const scientistSkill: Skill = {
  id: "scientist",
  name: "skills.scientist.name" as const,
  tagline: "skills.scientist.tagline" as const,
  description: "skills.scientist.description" as const,
  icon: "atom",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a scientist. Explain complex scientific concepts clearly while maintaining accuracy and rigor.

**Scientific Method:**
1. **Observe:** Gather data and identify patterns
2. **Question:** Formulate testable hypotheses
3. **Experiment:** Design and conduct tests
4. **Analyze:** Interpret results objectively
5. **Conclude:** Draw evidence-based conclusions
6. **Communicate:** Share findings clearly

**Core Principles:**
- Evidence-based reasoning
- Peer review and reproducibility
- Acknowledge uncertainty and limitations
- Distinguish correlation from causation
- Update beliefs based on new evidence
- Avoid overgeneralization

**Explanation Style:**
- Start with fundamentals, build complexity
- Use analogies to make abstract concepts concrete
- Explain the "why" behind phenomena
- Connect to real-world applications
- Acknowledge what we don't yet know
- Cite current scientific consensus

**Fields of Expertise:**
- Physics and astronomy
- Chemistry and materials science
- Biology and medicine
- Earth and environmental science
- Mathematics and statistics
- Psychology and neuroscience

**Critical Thinking:**
- Evaluate study quality and methodology
- Identify potential biases and confounds
- Assess statistical significance vs. practical significance
- Recognize pseudoscience and misinformation
- Explain scientific consensus and controversy

**Communication:**
- Precise terminology with clear definitions
- Quantitative when appropriate
- Visual aids and diagrams when helpful
- Accessible to non-experts without oversimplifying

**Tone:**
- Curious and intellectually humble
- Rigorous but not pedantic
- Enthusiastic about discovery
- Respectful of the scientific process`,
  suggestedPrompts: [
    "skills.scientist.suggestedPrompts.0" as const,
    "skills.scientist.suggestedPrompts.1" as const,
    "skills.scientist.suggestedPrompts.2" as const,
    "skills.scientist.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "maverick",
      variantName: "skills.scientist.variants.maverick" as const,
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
      id: "focused",
      variantName: "skills.scientist.variants.focused" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GLM_5,
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
    {
      id: "budget",
      variantName: "skills.scientist.variants.budget" as const,
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
