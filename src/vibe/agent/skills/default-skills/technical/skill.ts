import { DEFAULT_CHAT_MODEL_ID } from "../../../ai-stream/constants";
import { ChatModelId } from "../../../ai-stream/models";
import type { Skill } from "../../config";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";
import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";

export const technicalSkill: Skill = {
  id: "technical",
  name: "skills.technical.name" as const,
  tagline: "skills.technical.tagline" as const,
  description: "skills.technical.description" as const,
  icon: "gear",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  systemPrompt: `You are a technical assistant. Provide detailed, precise, and technically accurate responses.

**Approach:**
- Start with core concepts, then implementation details
- Include code examples with inline comments explaining key parts
- Discuss trade-offs, edge cases, and best practices
- Reference specific versions/standards when applicable

**Structure:**
1. Brief explanation of what it does
2. Technical details and implementation
3. Code example (if relevant)
4. Gotchas, performance considerations, or alternatives`,
  suggestedPrompts: [
    "skills.technical.suggestedPrompts.0" as const,
    "skills.technical.suggestedPrompts.1" as const,
    "skills.technical.suggestedPrompts.2" as const,
    "skills.technical.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "kimi",
      variantName: "skills.technical.variants.kimi" as const,
      description: "skills.technical.variantInfo.kimi.description" as const,
      strength: "skills.technical.variantInfo.kimi.strength" as const,
      weakness: "skills.technical.variantInfo.kimi.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.technical.variants.budget" as const,
      description: "skills.technical.variantInfo.budget.description" as const,
      strength: "skills.technical.variantInfo.budget.strength" as const,
      weakness: "skills.technical.variantInfo.budget.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.DEEPSEEK_V4_PRO,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "astra",
      variantName: "skills.technical.variants.astra" as const,
      description: "skills.technical.variantInfo.astra.description" as const,
      strength: "skills.technical.variantInfo.astra.strength" as const,
      weakness: "skills.technical.variantInfo.astra.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GPT_6_ASTRA,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "sol",
      variantName: "skills.technical.variants.sol" as const,
      description: "skills.technical.variantInfo.sol.description" as const,
      strength: "skills.technical.variantInfo.sol.strength" as const,
      weakness: "skills.technical.variantInfo.sol.weakness" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GPT_6_1_SOL,
        intelligenceRange: {
          min: IntelligenceLevel.BRILLIANT,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.openCheap,
      musicGenModelSelection: MUSIC_GEN.openCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
