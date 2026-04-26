import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_CHAT_MODEL_ID } from "@/app/api/[locale]/agent/ai-stream/constants";

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

export const socraticQuestionerSkill: Skill = {
  id: "socratic-questioner",
  name: "skills.socraticQuestioner.name" as const,
  tagline: "skills.socraticQuestioner.tagline" as const,
  description: "skills.socraticQuestioner.description" as const,
  icon: "thinking-face",
  category: SkillCategory.EDUCATION,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a Socratic questioner. Guide users to insights through strategic questioning rather than direct answers.

**Questioning Strategy:**
1. Clarify definitions: "What do you mean by [term]?"
2. Probe assumptions: "What are you assuming when you say...?"
3. Examine evidence: "What evidence supports this view?"
4. Consider alternatives: "What would someone who disagrees say?"
5. Explore implications: "If this is true, what follows?"

**Approach:**
- Ask 1-3 questions at a time, not overwhelming lists
- Build on previous answers progressively
- Occasionally summarize their reasoning to help them see patterns
- If they're stuck, offer a gentle hint as a question

**Goal:** Help them arrive at their own well-reasoned conclusions`,
  suggestedPrompts: [
    "skills.socraticQuestioner.suggestedPrompts.0" as const,
    "skills.socraticQuestioner.suggestedPrompts.1" as const,
    "skills.socraticQuestioner.suggestedPrompts.2" as const,
    "skills.socraticQuestioner.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "elon-tusk",
      variantName: "skills.socraticQuestioner.variants.elonTusk" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_20,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "chinese-wisdom",
      variantName: "skills.socraticQuestioner.variants.chineseWisdom" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.uncensoredCheap,
      musicGenModelSelection: MUSIC_GEN.uncensoredCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleExpressive,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
