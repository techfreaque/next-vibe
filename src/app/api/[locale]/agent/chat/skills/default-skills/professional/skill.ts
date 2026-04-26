import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

import type { Skill } from "../../config";

import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";

export const professionalSkill: Skill = {
  id: "professional",
  name: "skills.professional.name" as const,
  tagline: "skills.professional.tagline" as const,
  description: "skills.professional.description" as const,
  icon: "briefcase",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
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
  variants: [
    {
      id: "fast",
      variantName: "skills.professional.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_FAST,
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
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleAuthoritative,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.professional.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GLM_4_7_FLASH,
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
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleAuthoritative,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
