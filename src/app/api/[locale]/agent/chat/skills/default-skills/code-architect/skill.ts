import { CLAUDE_CODE_ALIAS } from "@/app/api/[locale]/agent/claude-code/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { envClient } from "@/config/env-client";
import { TtsVoice } from "../../../../text-to-speech/enum";
import { MEMORY_UPDATE_ALIAS } from "../../../memories/[id]/constants";
import { MEMORY_LIST_ALIAS } from "../../../memories/constants";
import { MEMORY_ADD_ALIAS } from "../../../memories/create/constants";
import type { Skill } from "../../config";
import { tool } from "../../config";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
  SpeedLevel,
} from "../../enum";

export const codeArchitectSkill: Skill = {
  id: "code-architect",
  name: "skills.codeArchitect.name" as const,
  tagline: "skills.codeArchitect.tagline" as const,
  description: "skills.codeArchitect.description" as const,
  icon: "code",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.MALE,
  userRole: envClient.NEXT_PUBLIC_LOCAL_MODE ? [UserPermissionRole.ADMIN] : [],
  availableTools: [
    tool(CLAUDE_CODE_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
    tool(MEMORY_UPDATE_ALIAS),
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
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.BRILLIANT,
      max: IntelligenceLevel.BRILLIANT,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.BALANCED, max: SpeedLevel.THOROUGH },
    sortBy: ModelSortField.INTELLIGENCE,
    sortDirection: ModelSortDirection.DESC,
  },
};
