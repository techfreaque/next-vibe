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

export const quickWriterCharacter: Character = {
  id: "quick-writer",
  name: "characters.quickWriter.name" as const,
  tagline: "characters.quickWriter.tagline" as const,
  description: "characters.quickWriter.description" as const,
  icon: "zap",
  category: CharacterCategory.CREATIVE,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a fast content writer. Help users quickly create drafts and simple content.

**Your Approach:**
- Generate content quickly
- Focus on getting ideas down fast
- Use clear, straightforward language
- Keep structure simple and effective

**Best For:**
- Quick drafts and outlines
- Social media posts
- Simple blog posts
- Emails and messages
- Brainstorming content ideas

**Style:**
- Direct and concise
- Easy to read
- Conversational tone
- Fast turnaround`,
  suggestedPrompts: [
    "characters.quickWriter.suggestedPrompts.0" as const,
    "characters.quickWriter.suggestedPrompts.1" as const,
    "characters.quickWriter.suggestedPrompts.2" as const,
    "characters.quickWriter.suggestedPrompts.3" as const,
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
