import { CODING_AGENT_ALIAS } from "@/app/api/[locale]/agent/coding-agent/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";
import { envClient } from "@/config/env-client";
import {
  CORTEX_EDIT_ALIAS,
  CORTEX_READ_ALIAS,
  CORTEX_SEARCH_ALIAS,
} from "../../../../cortex/constants";

import {
  CORTEX_LIST_ALIAS,
  CORTEX_WRITE_ALIAS,
} from "../../../../cortex/constants";
import type { Skill } from "../../config";
import { tool } from "../../config";

import { SQL_ALIAS } from "@/app/api/[locale]/system/db/sql/constants";
import { REBUILD_ALIAS } from "@/app/api/[locale]/system/server/rebuild/constants";
import { EXECUTE_TOOL_ALIAS } from "@/app/api/[locale]/system/unified-interface/ai/execute-tool/constants";
import { WAIT_FOR_TASK_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/wait-for-task/constants";
import { AI_RUN_ALIAS } from "../../../../ai-stream/run/constants";

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

export const codeArchitectSkill: Skill = {
  id: "code-architect",
  name: "skills.codeArchitect.name" as const,
  tagline: "skills.codeArchitect.tagline" as const,
  description: "skills.codeArchitect.description" as const,
  icon: "code",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: envClient.NEXT_PUBLIC_LOCAL_MODE ? [UserPermissionRole.ADMIN] : [],
  availableTools: [
    tool(TOOL_HELP_ALIAS),
    tool(EXECUTE_TOOL_ALIAS),
    tool(WAIT_FOR_TASK_ALIAS),
    tool(CORTEX_READ_ALIAS),
    tool(CORTEX_WRITE_ALIAS),
    tool(CORTEX_EDIT_ALIAS),
    tool(CORTEX_LIST_ALIAS),
    tool(CORTEX_SEARCH_ALIAS),
    tool(CODING_AGENT_ALIAS),
    tool(AI_RUN_ALIAS),
    tool(CODING_AGENT_ALIAS),
    tool(SQL_ALIAS),
    tool(REBUILD_ALIAS),
  ],
  systemPrompt: `You are a Code Architect - an architecture specialist available on Hermes for delegating coding tasks to Claude Code.

**Your Tools:**
- Claude Code for launching coding sessions (interactive or headless)
- Memories for storing architectural decisions and patterns
- Tool discovery (tool-help) for finding additional development tools

**Your Approach:**
1. **Understand** the requirement or problem
2. **Design** the architecture and approach
3. **Document** key decisions in memories
4. **Delegate** implementation to Claude Code with clear instructions
5. **Review** the output and iterate

**Architecture Principles:**
- Follow existing codebase patterns (check CLAUDE.md)
- Prefer simple solutions over clever ones
- Design for the current requirement, not hypothetical futures
- Document architectural decisions and their rationale
- Use memories to maintain context across sessions

**When delegating to Claude Code:**
- Provide clear, specific task descriptions
- Include relevant file paths and context
- Specify expected outcomes and constraints
- Prefer interactive mode for complex tasks that need human input`,
  suggestedPrompts: [
    "skills.codeArchitect.suggestedPrompts.0" as const,
    "skills.codeArchitect.suggestedPrompts.1" as const,
    "skills.codeArchitect.suggestedPrompts.2" as const,
    "skills.codeArchitect.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "gemini",
      variantName: "skills.codeArchitect.variants.gemini" as const,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "tech-bro",
      variantName: "skills.codeArchitect.variants.techBro" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_SONNET_4_6,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
