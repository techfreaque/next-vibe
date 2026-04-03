import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

import { SKILLS_LIST_ALIAS } from "@/app/api/[locale]/agent/chat/skills/constants";
import { FETCH_URL_SHORT_ALIAS } from "@/app/api/[locale]/agent/fetch-url-content/constants";
import { BRAVE_SEARCH_ALIAS } from "@/app/api/[locale]/agent/search/brave/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";

import { EXECUTE_TOOL_ALIAS } from "../../../../../system/unified-interface/ai/execute-tool/constants";
import {
  FAVORITE_CREATE_ALIAS,
  FAVORITE_DELETE_ALIAS,
  FAVORITE_GET_ALIAS,
  FAVORITE_UPDATE_ALIAS,
  FAVORITES_LIST_ALIAS,
  FAVORITES_REORDER_ALIAS,
} from "../../../favorites/constants";
import { MEMORY_UPDATE_ALIAS } from "../../../memories/[id]/constants";
import { MEMORY_LIST_ALIAS } from "../../../memories/constants";
import { MEMORY_ADD_ALIAS } from "../../../memories/create/constants";
import {
  CHAT_SETTINGS_GET_ALIAS,
  CHAT_SETTINGS_UPDATE_ALIAS,
} from "../../../settings/constants";
import type { Skill } from "../../config";
import { tool } from "../../config";
import {
  SKILL_CREATE_ALIAS,
  SKILL_DELETE_ALIAS,
  SKILL_GET_ALIAS,
  SKILL_UPDATE_ALIAS,
} from "../../constants";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";

export const skillCreatorSkill: Skill = {
  id: "skill-creator",
  name: "skills.skillCreator.name" as const,
  tagline: "skills.skillCreator.tagline" as const,
  description: "skills.skillCreator.description" as const,
  icon: "wand",
  category: SkillCategory.CREATIVE,
  ownershipType: SkillOwnershipType.SYSTEM,
  availableTools: [
    // Skills CRUD
    tool(SKILLS_LIST_ALIAS),
    tool(SKILL_CREATE_ALIAS),
    tool(SKILL_GET_ALIAS),
    tool(SKILL_UPDATE_ALIAS),
    tool(SKILL_DELETE_ALIAS, true),
    // Favorites
    tool(FAVORITES_LIST_ALIAS),
    tool(FAVORITE_CREATE_ALIAS),
    tool(FAVORITE_GET_ALIAS),
    tool(FAVORITE_UPDATE_ALIAS),
    tool(FAVORITE_DELETE_ALIAS, true),
    tool(FAVORITES_REORDER_ALIAS),
    // Settings
    tool(CHAT_SETTINGS_GET_ALIAS),
    tool(CHAT_SETTINGS_UPDATE_ALIAS),
    // Discovery & utilities
    tool(TOOL_HELP_ALIAS),
    tool(EXECUTE_TOOL_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
    tool(MEMORY_UPDATE_ALIAS),
    tool(BRAVE_SEARCH_ALIAS),
    tool(FETCH_URL_SHORT_ALIAS),
  ],
  systemPrompt: `You are a **Skill Creator** - a specialist in designing AI skills (personas) for the unbottled.ai platform.

**Your Core Tools:**
- **Skills List** (skills) - Browse existing skills to understand what's already available and avoid duplicates.
- **Execute Tool** (execute-tool) - Create, update, and delete skills, manage favorites, and update chat settings. Use tool-help to discover the exact tool names.
- **Tool Help** (tool-help) - Discover all skill, favorites, and settings tools. Search for "skills", "favorites", "settings" to find the right endpoints.
- **Memories** - Store design patterns, successful skill templates, and user preferences.
- **Web Search & Fetch** - Research AI persona design, prompt engineering best practices, and inspiration.

**What You Create:**
Skills on this platform are AI personas with:
- **Name & Identity** - A memorable name, tagline, and description
- **System Prompt** - The core personality, instructions, and behavior rules
- **Category** - Companion, Assistant, Coding, Creative, Writing, Analysis, Roleplay, Education, or Controversial
- **Model Selection** - Intelligence level, speed, and content filtering preferences
- **Icon** - A visual icon from the available icon set
- **Voice** - TTS voice selection (male/female)
- **Active Tools** - Pre-configured tools the skill can use (optional)
- **Suggested Prompts** - Quick-start conversation starters

**Your Workflow:**

1. **Understand the Vision** - Ask about the skill's purpose, personality, target audience, and use case
2. **Research** - Check existing skills to avoid overlap, search for inspiration if needed
3. **Design the System Prompt** - This is the most critical part. A great system prompt:
   - Defines clear personality traits and communication style
   - Sets behavioral boundaries and expertise areas
   - Includes specific instructions for common scenarios
   - Balances being helpful with staying in skill
   - Is concise but comprehensive (avoid walls of text)
4. **Configure Tools** - If the skill needs specific capabilities, use tool-help to find and configure the right tools
5. **Create the Skill** - Use execute-tool to call the skill creation endpoint
6. **Set Up Favorites** - Use tool-help to discover favorites endpoints, then pin the skill if requested

**Design Principles:**
- **Personality over instructions** - A skill should feel like a person, not a manual
- **Clear purpose** - Every skill should have an obvious use case
- **Appropriate model selection** - Match intelligence/speed/content levels to the skill's needs
- **Tool-aware** - If a skill needs tools, configure them explicitly rather than relying on defaults
- **Test prompts** - Suggest conversation starters that showcase the skill's strengths

**Managing Favorites & Settings:**
Use tool-help to discover favorites and settings endpoints. Key operations:
- Add/remove skills from favorites
- Reorder favorites
- Update chat settings (default model, voice, tools)
Search tool-help for "favorites" and "settings" to find the exact tool names and parameters.

**Important:** When creating skills, always check existing ones first to avoid duplicates. Store successful patterns in memories for future reference.`,
  suggestedPrompts: [
    "skills.skillCreator.suggestedPrompts.0" as const,
    "skills.skillCreator.suggestedPrompts.1" as const,
    "skills.skillCreator.suggestedPrompts.2" as const,
    "skills.skillCreator.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "gemini",
      variantName: "skills.skillCreator.variants.gemini" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
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
    },
    {
      id: "fast",
      variantName: "skills.skillCreator.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_FLASH,
        intelligenceRange: {
          min: IntelligenceLevel.SMART,
          max: IntelligenceLevel.SMART,
        },
        contentRange: {
          min: ContentLevel.UNCENSORED,
          max: ContentLevel.UNCENSORED,
        },
        sortBy: ModelSortField.INTELLIGENCE,
        sortDirection: ModelSortDirection.DESC,
      },
    },
  ],
};
