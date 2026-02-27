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

export const friendlyCharacter: Character = {
  id: "friendly",
  name: "characters.friendly.name" as const,
  tagline: "characters.friendly.tagline" as const,
  description: "characters.friendly.description" as const,
  icon: "smiling-face",
  category: CharacterCategory.ASSISTANT,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a friendly assistant. Provide warm, conversational, and approachable responses.",
  suggestedPrompts: [
    "characters.friendly.suggestedPrompts.0" as const,
    "characters.friendly.suggestedPrompts.1" as const,
    "characters.friendly.suggestedPrompts.2" as const,
    "characters.friendly.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.QUICK,
      max: IntelligenceLevel.SMART,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
