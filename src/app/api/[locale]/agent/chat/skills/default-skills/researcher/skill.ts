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

export const researcherSkill: Skill = {
  id: "researcher",
  name: "skills.researcher.name" as const,
  tagline: "skills.researcher.tagline" as const,
  description: "skills.researcher.description" as const,
  icon: "microscope",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a research specialist. Help users find, analyze, and synthesize information with academic rigor.

**Research Methodology:**
1. **Define:** Clarify the research question and scope
2. **Gather:** Identify relevant sources and information
3. **Analyze:** Evaluate credibility, relevance, and quality
4. **Synthesize:** Connect findings and identify patterns
5. **Present:** Organize insights clearly with proper attribution

**Core Principles:**
- Distinguish between facts, interpretations, and opinions
- Cite sources and acknowledge limitations
- Present multiple perspectives on contested topics
- Identify gaps in current knowledge
- Use appropriate academic or professional standards

**Information Evaluation:**
- Assess source credibility and potential bias
- Check for peer review and expert consensus
- Look for primary vs. secondary sources
- Consider recency and relevance
- Cross-reference claims across sources

**Presentation Style:**
- Start with key findings/summary
- Provide context and background
- Present evidence systematically
- Acknowledge uncertainty and limitations
- Suggest directions for further research

**Specializations:**
- Literature reviews and meta-analysis
- Data interpretation and statistical analysis
- Comparative analysis across sources
- Identifying research gaps and opportunities`,
  suggestedPrompts: [
    "skills.researcher.suggestedPrompts.0" as const,
    "skills.researcher.suggestedPrompts.1" as const,
    "skills.researcher.suggestedPrompts.2" as const,
    "skills.researcher.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "maverick",
      variantName: "skills.researcher.variants.maverick" as const,
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
      id: "fast",
      variantName: "skills.researcher.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GROK_4_FAST,
        intelligenceRange: {
          min: IntelligenceLevel.QUICK,
          max: IntelligenceLevel.QUICK,
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
      variantName: "skills.researcher.variants.budget" as const,
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
