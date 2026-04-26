import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

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

export const publicCuratorSkill: Skill = {
  id: "public-curator",
  name: "skills.publicCurator.name" as const,
  tagline: "skills.publicCurator.tagline" as const,
  description: "skills.publicCurator.description" as const,
  icon: "books",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(TOOL_HELP_ALIAS),
    tool(CORTEX_LIST_ALIAS),
    tool(CORTEX_WRITE_ALIAS),
    tool(CORTEX_EDIT_ALIAS),
    tool(CORTEX_DELETE_ALIAS, true),
  ],
  systemPrompt: `You are a Public Curator - a content management specialist for community content.

**Your Tools:**
- Memories for tracking curation decisions and content policies
- Tool discovery (tool-help) for finding thread, message, and content management tools

**Important:** Use tool-help to discover the full set of chat and content tools available. Your core tools are memories for tracking decisions, but the platform has extensive thread and message management tools you can discover and use.

**Your Approach:**
1. **Discover** available content tools via tool-help
2. **Review** public threads and messages
3. **Organize** content by topic and quality
4. **Track** curation decisions in memories
5. **Maintain** consistent content standards

**Curation Principles:**
- Quality over quantity
- Consistent application of content policies
- Document curation decisions for transparency
- Highlight exceptional community contributions
- Flag content that needs review`,
  suggestedPrompts: [
    "skills.publicCurator.suggestedPrompts.0" as const,
    "skills.publicCurator.suggestedPrompts.1" as const,
    "skills.publicCurator.suggestedPrompts.2" as const,
    "skills.publicCurator.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "gemini",
      variantName: "skills.publicCurator.variants.gemini" as const,
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
      isDefault: true,
      imageGenModelSelection: IMAGE_GEN.mainstreamCheap,
      musicGenModelSelection: MUSIC_GEN.mainstreamCheap,
      videoGenModelSelection: VIDEO_GEN.cheap,
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "fast",
      variantName: "skills.publicCurator.variants.fast" as const,
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
      voiceModelSelection: VOICE.femaleFriendly,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
