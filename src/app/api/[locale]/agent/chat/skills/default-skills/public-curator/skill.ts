import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice } from "../../../../text-to-speech/enum";
import {
  MEMORY_DELETE_ALIAS,
  MEMORY_UPDATE_ALIAS,
} from "../../../memories/[id]/constants";
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

export const publicCuratorSkill: Skill = {
  id: "public-curator",
  name: "skills.publicCurator.name" as const,
  tagline: "skills.publicCurator.tagline" as const,
  description: "skills.publicCurator.description" as const,
  icon: "books",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(TOOL_HELP_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
    tool(MEMORY_UPDATE_ALIAS),
    tool(MEMORY_DELETE_ALIAS, true),
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
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
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
