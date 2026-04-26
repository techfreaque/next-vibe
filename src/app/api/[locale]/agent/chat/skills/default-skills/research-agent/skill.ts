import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { DEFAULT_CHAT_MODEL_ID } from "@/app/api/[locale]/agent/ai-stream/constants";

import { FETCH_URL_SHORT_ALIAS } from "@/app/api/[locale]/agent/fetch-url-content/constants";
import { WEB_SEARCH_ALIAS } from "@/app/api/[locale]/agent/search/web-search/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import {
  CORTEX_DELETE_ALIAS,
  CORTEX_EDIT_ALIAS,
  CORTEX_LIST_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../../../../cortex/constants";
import type { Skill } from "../../config";
import { tool } from "../../config";

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

export const researchAgentSkill: Skill = {
  id: "research-agent",
  name: "skills.researchAgent.name" as const,
  tagline: "skills.researchAgent.tagline" as const,
  description: "skills.researchAgent.description" as const,
  icon: "magnifying-glass-icon",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
  availableTools: [
    tool(WEB_SEARCH_ALIAS),
    tool(FETCH_URL_SHORT_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(CORTEX_LIST_ALIAS),
    tool(CORTEX_WRITE_ALIAS),
    tool(CORTEX_EDIT_ALIAS),
    tool(CORTEX_DELETE_ALIAS, true),
  ],
  systemPrompt: `You are a Web Agent — you find things, read things, and get things done on the internet.

**Your core tools:**
- \`web-search\` — search the web (user's preferred engine, auto-selected)
- \`fetch-url\` — read any URL and extract content as markdown
- Memories — store findings for future sessions
- \`tool-help\` — discover additional tools (browser automation, etc.)

**How you work:**
1. Search first, read second. Don't fetch URLs blindly — search to find the right ones.
2. Cross-reference. One source is a rumor. Two sources is a lead. Three is a fact.
3. When a page won't load or is JS-heavy, check \`tool-help --query browser\` for browser tools that can handle it.
4. Store important findings in memories so they survive across sessions.

**Output rules:**
- Lead with the answer, not the process
- Always cite sources with URLs
- Flag uncertainty: confirmed / likely / uncertain
- If sources contradict each other, say so`,
  suggestedPrompts: [
    "skills.researchAgent.suggestedPrompts.0" as const,
    "skills.researchAgent.suggestedPrompts.1" as const,
    "skills.researchAgent.suggestedPrompts.2" as const,
    "skills.researchAgent.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "kimi",
      variantName: "skills.researchAgent.variants.kimi" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: DEFAULT_CHAT_MODEL_ID,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "gemini",
      variantName: "skills.researchAgent.variants.gemini" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
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
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "flash",
      variantName: "skills.researchAgent.variants.flash" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_FLASH,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "grok",
      variantName: "skills.researchAgent.variants.grok" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GROK_4_FAST,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "claude",
      variantName: "skills.researchAgent.variants.claude" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_HAIKU_4_5,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.MAINSTREAM,
          max: ContentLevel.MAINSTREAM,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.neutral,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
