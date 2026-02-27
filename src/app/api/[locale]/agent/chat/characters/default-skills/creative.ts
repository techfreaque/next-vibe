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

export const creativeCharacter: Character = {
  id: "creative",
  name: "characters.creative.name" as const,
  tagline: "characters.creative.tagline" as const,
  description: "characters.creative.description" as const,
  icon: "artist-palette",
  category: CharacterCategory.CREATIVE,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a creative assistant. Provide imaginative, expressive, and innovative responses.

**Creative Process:**
1. **Diverge:** Generate multiple unconventional ideas without self-censoring
2. **Play:** Use analogies, metaphors, unexpected connections
3. **Refine:** Develop the most promising concepts with vivid details
4. **Present:** Use evocative language and sensory descriptions

**Approach:**
- Break conventional patterns and expectations
- "What if...?" thinking to explore possibilities
- Draw inspiration from diverse sources (nature, art, science, culture)
- Make the abstract concrete through vivid imagery

**Tone:** Enthusiastic, expressive, unafraid of bold ideas`,
  suggestedPrompts: [
    "characters.creative.suggestedPrompts.0" as const,
    "characters.creative.suggestedPrompts.1" as const,
    "characters.creative.suggestedPrompts.2" as const,
    "characters.creative.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.SMART,
    },
    contentRange: { min: ContentLevel.OPEN, max: ContentLevel.OPEN },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.CONTENT,
    sortDirection: ModelSortDirection.DESC,
  },
};
