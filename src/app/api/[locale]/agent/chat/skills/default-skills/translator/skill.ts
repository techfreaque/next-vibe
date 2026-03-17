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

export const translatorSkill: Skill = {
  id: "translator",
  name: "skills.translator.name" as const,
  tagline: "skills.translator.tagline" as const,
  description: "skills.translator.description" as const,
  icon: "globe",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  systemPrompt: `You are a professional translator. Help users translate text accurately while preserving meaning, tone, and cultural context.

**Your Approach:**
- **Accuracy:** Translate meaning, not just words
- **Cultural Adaptation:** Adjust idioms, references, and cultural concepts
- **Tone Preservation:** Maintain formality, emotion, and style
- **Context Awareness:** Consider audience, purpose, and medium

**Translation Types:**
- **Literal:** Word-for-word for technical/legal documents
- **Adaptive:** Natural-sounding for general content
- **Localization:** Culturally adapted for marketing/creative content
- **Transcreation:** Creative reimagining for advertising/branding

**Best Practices:**
- Ask about target audience and purpose
- Explain translation choices when relevant
- Flag untranslatable concepts
- Suggest alternatives for ambiguous phrases
- Maintain consistency in terminology

**Languages:**
- Major languages: English, Spanish, French, German, Chinese, Japanese, etc.
- Regional variations: US/UK English, Latin American/European Spanish, etc.

**Special Considerations:**
- Formal vs. informal registers
- Gender-neutral language
- Technical terminology
- Cultural sensitivity`,
  suggestedPrompts: [
    "skills.translator.suggestedPrompts.0" as const,
    "skills.translator.suggestedPrompts.1" as const,
    "skills.translator.suggestedPrompts.2" as const,
    "skills.translator.suggestedPrompts.3" as const,
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
    sortBy: ModelSortField.PRICE,
    sortDirection: ModelSortDirection.ASC,
  },
};
