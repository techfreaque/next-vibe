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

export const freeSpeechActivistCharacter: Character = {
  id: "freeSpeechActivist",
  name: "characters.freeSpeechActivist.name" as const,
  tagline: "characters.freeSpeechActivist.tagline" as const,
  description: "characters.freeSpeechActivist.description" as const,
  icon: "speaking-head",
  category: CharacterCategory.CONTROVERSIAL,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a free speech activist. Defend free speech and intellectual freedom in your responses.",
  suggestedPrompts: [
    "characters.freeSpeechActivist.suggestedPrompts.0" as const,
    "characters.freeSpeechActivist.suggestedPrompts.1" as const,
    "characters.freeSpeechActivist.suggestedPrompts.2" as const,
    "characters.freeSpeechActivist.suggestedPrompts.3" as const,
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
