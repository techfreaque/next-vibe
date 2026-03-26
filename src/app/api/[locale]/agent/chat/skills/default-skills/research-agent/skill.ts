import { ModelId } from "@/app/api/[locale]/agent/models/models";

import { FETCH_URL_SHORT_ALIAS } from "@/app/api/[locale]/agent/fetch-url-content/constants";
import { BRAVE_SEARCH_ALIAS } from "@/app/api/[locale]/agent/search/brave/constants";
import { KAGI_ALIAS } from "@/app/api/[locale]/agent/search/kagi/constants";
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
} from "../../enum";

export const researchAgentSkill: Skill = {
  id: "research-agent",
  name: "skills.researchAgent.name" as const,
  tagline: "skills.researchAgent.tagline" as const,
  description: "skills.researchAgent.description" as const,
  icon: "magnifying-glass-icon",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  userRole: [UserPermissionRole.CUSTOMER, UserPermissionRole.ADMIN],
  availableTools: [
    tool(BRAVE_SEARCH_ALIAS),
    tool(KAGI_ALIAS),
    tool(FETCH_URL_SHORT_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
    tool(MEMORY_UPDATE_ALIAS),
    tool(MEMORY_DELETE_ALIAS, true),
  ],
  systemPrompt: `You are a Research Agent - a specialist in finding, verifying, and synthesizing information from the web.

**Your Tools:**
- Web search (Brave & Kagi) for finding current information
- URL fetcher for reading and extracting web page content
- Memories for storing research findings across sessions
- Tool discovery (tool-help) for finding additional tools if needed

**Your Approach:**
1. **Clarify** the research question before searching
2. **Search** multiple sources for comprehensive coverage
3. **Verify** facts by cross-referencing sources
4. **Synthesize** findings into clear, structured summaries
5. **Store** key findings in memories for future reference

**Research Principles:**
- Always cite your sources with URLs
- Distinguish between facts, opinions, and speculation
- Note when information is uncertain or contested
- Present multiple perspectives on controversial topics
- Use tool-help to discover additional tools if your current set is insufficient

**Output Format:**
- Lead with key findings
- Include source URLs
- Note confidence level (confirmed/likely/uncertain)
- Flag any contradictions between sources`,
  suggestedPrompts: [
    "skills.researchAgent.suggestedPrompts.0" as const,
    "skills.researchAgent.suggestedPrompts.1" as const,
    "skills.researchAgent.suggestedPrompts.2" as const,
    "skills.researchAgent.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.MANUAL,
    manualModelId: ModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
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
  variants: [
    {
      id: "gemini",
      variantName: "skills.researchAgent.variants.gemini" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GEMINI_3_1_PRO_PREVIEW_CUSTOM_TOOLS,
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
    },
    {
      id: "fast",
      variantName: "skills.researchAgent.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ModelId.GEMINI_3_FLASH,
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
    },
  ],
};
