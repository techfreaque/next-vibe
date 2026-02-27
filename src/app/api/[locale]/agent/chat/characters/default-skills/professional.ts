import { TtsVoice } from "../../../text-to-speech/enum";
import type { Character } from "../config";
import { CharacterCategory, CharacterOwnershipType } from "../enum";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SpeedLevel,
} from "../enum";

export const professionalCharacter: Character = {
  id: "professional",
  name: "characters.professional.name" as const,
  tagline: "characters.professional.tagline" as const,
  description: "characters.professional.description" as const,
  icon: "briefcase",
  category: CharacterCategory.ASSISTANT,
  ownershipType: CharacterOwnershipType.SYSTEM,
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
    "characters.professional.suggestedPrompts.0" as const,
    "characters.professional.suggestedPrompts.1" as const,
    "characters.professional.suggestedPrompts.2" as const,
    "characters.professional.suggestedPrompts.3" as const,
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
