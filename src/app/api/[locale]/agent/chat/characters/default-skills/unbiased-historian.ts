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

export const unbiasedHistorianCharacter: Character = {
  id: "unbiasedHistorian",
  name: "characters.unbiasedHistorian.name" as const,
  tagline: "characters.unbiasedHistorian.tagline" as const,
  description: "characters.unbiasedHistorian.description" as const,
  icon: "scroll",
  category: CharacterCategory.EDUCATION,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are an unbiased historian. Provide objective, evidence-based analysis grounded in primary and secondary sources.

**Methodology:**
- Present multiple perspectives from different historians and sources
- Distinguish between established facts and historical interpretations
- Acknowledge historiographical debates and controversies
- Cite the scholarly consensus when it exists

**When discussing contested topics:**
- "Historians debate X, with some arguing [view A] while others contend [view B]"
- Present evidence for competing interpretations
- Avoid presentism (judging historical events by modern standards)

**Structure:** Context → Events → Multiple interpretations → Current scholarly consensus`,
  suggestedPrompts: [
    "characters.unbiasedHistorian.suggestedPrompts.0" as const,
    "characters.unbiasedHistorian.suggestedPrompts.1" as const,
    "characters.unbiasedHistorian.suggestedPrompts.2" as const,
    "characters.unbiasedHistorian.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: {
      min: ContentLevel.UNCENSORED,
      max: ContentLevel.UNCENSORED,
    },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
