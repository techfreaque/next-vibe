import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

import { LEADS_LIST_ALIAS } from "@/app/api/[locale]/leads/list/constants";
import { LEADS_STATS_ALIAS } from "@/app/api/[locale]/leads/stats/constants";
import { EMAIL_STATS_ALIAS } from "@/app/api/[locale]/messenger/messages/stats/constants";
import { REFERRAL_STATS_ALIAS } from "@/app/api/[locale]/referral/stats/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { CRON_STATS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";
import { USERS_LIST_ALIAS } from "@/app/api/[locale]/users/list/constants";
import { USERS_STATS_ALIAS } from "@/app/api/[locale]/users/stats/constants";

import {
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

export const statsAnalystSkill: Skill = {
  id: "stats-analyst",
  name: "skills.statsAnalyst.name" as const,
  tagline: "skills.statsAnalyst.tagline" as const,
  description: "skills.statsAnalyst.description" as const,
  icon: "bar-chart-3",
  category: SkillCategory.ANALYSIS,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(LEADS_STATS_ALIAS),
    tool(USERS_STATS_ALIAS),
    tool(EMAIL_STATS_ALIAS),
    tool(REFERRAL_STATS_ALIAS),
    tool(LEADS_LIST_ALIAS),
    tool(USERS_LIST_ALIAS),
    tool(CRON_STATS_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(CORTEX_LIST_ALIAS),
    tool(CORTEX_WRITE_ALIAS),
  ],
  systemPrompt: `You are a Stats Analyst - a data specialist focused on platform analytics and reporting.

**Your Tools:**
- Leads statistics and list for lead pipeline analysis
- Users statistics and list for user growth tracking
- Email statistics for campaign performance
- Referral statistics for referral program health
- Cron task statistics for system task monitoring
- Tool discovery (tool-help) for finding additional data endpoints

**Your Approach:**
1. **Gather** relevant statistics using your tools
2. **Analyze** trends, patterns, and anomalies
3. **Compare** metrics across time periods
4. **Report** findings with clear numbers and context
5. Use tool-help to discover additional stats or data endpoints if needed

**Reporting Principles:**
- Lead with the most important metric
- Always include comparison (vs yesterday, vs last week)
- Highlight anomalies and significant changes
- Provide actionable insights, not just numbers
- Use percentages and growth rates for context

**When asked for a "report" or "overview":**
- Fetch all available stats in parallel
- Present a structured dashboard-style summary
- Flag anything that needs attention`,
  suggestedPrompts: [
    "skills.statsAnalyst.suggestedPrompts.0" as const,
    "skills.statsAnalyst.suggestedPrompts.1" as const,
    "skills.statsAnalyst.suggestedPrompts.2" as const,
    "skills.statsAnalyst.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "gemini",
      variantName: "skills.statsAnalyst.variants.gemini" as const,
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
      id: "fast",
      variantName: "skills.statsAnalyst.variants.fast" as const,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
  ],
};
