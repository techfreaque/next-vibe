import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { ChatModelId } from "../../../ai-stream/models";
import { ImageGenModelId } from "../../../image-generation/models";
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

export const qualityTesterSkill: Skill = {
  id: "quality-tester",
  name: "skills.qualityTester.name" as const,
  tagline: "skills.qualityTester.tagline" as const,
  description: "skills.qualityTester.description" as const,
  icon: "shield-plus",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.ADMIN],
  systemPrompt: `You are an AI assistant on a platform where users pay credits per interaction. Do what the user asks.

While doing it, pay attention to everything you encounter: tool descriptions, parameter names, error messages, result formats, credit costs. You are the last line of defense before a real user sees this.

HARD STOP - if any of these happen, stop and report instead of retrying or working around it:
- A tool returns an error, empty result, or nonsensical output
- Same failure happens twice
- A generated result (image/music/video) is missing, broken URL, or clearly wrong
- Credit cost seems unreasonable for what was done
- You see raw IDs, internal field names, JSON blobs, or stack traces in anything user-facing
- A tool name, description, or parameter is confusing or misleading
- An error message doesn't tell the user what to do about it
- You hit a dead end with no path forward

Failure report format:
1. What the user asked for
2. What actually happened
3. Exact error text, tool name, or result
4. Severity: BLOCKER (unusable) | MAJOR (works but wrong) | MINOR (cosmetic/confusing)

If everything works, respond normally to the user. Only flag issues - don't narrate the process.`,
  suggestedPrompts: [
    "skills.qualityTester.suggestedPrompts.0" as const,
    "skills.qualityTester.suggestedPrompts.1" as const,
    "skills.qualityTester.suggestedPrompts.2" as const,
    "skills.qualityTester.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "budget",
      variantName: "skills.qualityTester.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        // DeepSeek V4 Flash: same tool-calling capability class as kimi at a
        // fraction of the price — the QA suites hammer this model constantly.
        manualModelId: ChatModelId.DEEPSEEK_V4_FLASH,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.BRILLIANT,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.OPEN,
        },
        sortBy: ModelSortField.PRICE,
        sortDirection: ModelSortDirection.ASC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.geminiFlash,
    },
    {
      id: "native-image",
      variantName: "skills.qualityTester.variants.nativeImage" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        // Gemini 3.1 Flash Image Preview (Nano Banana): the chat model IS the
        // image model — native image generation without a tool round-trip.
        manualModelId: ChatModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        intelligenceRange: {
          min: IntelligenceLevel.QUICK,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.OPEN,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.PRICE,
        sortDirection: ModelSortDirection.ASC,
      },
      imageGenModelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ImageGenModelId.GEMINI_3_1_FLASH_IMAGE_PREVIEW,
        sortBy: ModelSortField.PRICE,
        sortDirection: ModelSortDirection.ASC,
      },
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.geminiFlash,
    },
  ],
};
