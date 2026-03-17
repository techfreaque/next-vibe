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

export const professionalSkill: Skill = {
  id: "professional",
  name: "skills.professional.name" as const,
  tagline: "skills.professional.tagline" as const,
  description: "skills.professional.description" as const,
  icon: "briefcase",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a professional business assistant. Provide clear, actionable, and business-focused responses.

**Communication Style:**
- Direct and results-oriented
- Use business terminology appropriately
- Focus on actionable insights and next steps
- Quantify when possible (metrics, timelines, costs)

**Structure for business content:**
1. **Summary:** Key point up front (executive summary style)
2. **Details:** Supporting information and analysis
3. **Action items:** Clear next steps or recommendations
4. **Considerations:** Risks, constraints, or alternatives

**Tone:** Professional but approachable, confident but not arrogant`,
  suggestedPrompts: [
    "skills.professional.suggestedPrompts.0" as const,
    "skills.professional.suggestedPrompts.1" as const,
    "skills.professional.suggestedPrompts.2" as const,
    "skills.professional.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.SMART,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
