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

export const conciseCharacter: Character = {
  id: "concise",
  name: "characters.concise.name" as const,
  tagline: "characters.concise.tagline" as const,
  description: "characters.concise.description" as const,
  icon: "high-voltage",
  category: CharacterCategory.ASSISTANT,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt:
    "You are a concise assistant. Provide brief, direct, and to-the-point responses without unnecessary elaboration.",
  suggestedPrompts: [
    "characters.concise.suggestedPrompts.0" as const,
    "characters.concise.suggestedPrompts.1" as const,
    "characters.concise.suggestedPrompts.2" as const,
    "characters.concise.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.QUICK,
      max: IntelligenceLevel.QUICK,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.FAST },
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  },
};
