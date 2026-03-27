import { ModelId } from "@/app/api/[locale]/agent/models/models";

import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import {
  CRON_DELETE_ALIAS,
  CRON_GET_ALIAS,
  CRON_UPDATE_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/[id]/constants";
import { CRON_HISTORY_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/constants";
import { CRON_STATS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/constants";
import {
  CRON_CREATE_ALIAS,
  CRON_LIST_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/constants";
import { PULSE_EXECUTE_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/execute/constants";
import { PULSE_STATUS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/status/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice } from "../../../../text-to-speech/enum";
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

export const cronManagerSkill: Skill = {
  id: "cron-manager",
  name: "skills.cronManager.name" as const,
  tagline: "skills.cronManager.tagline" as const,
  description: "skills.cronManager.description" as const,
  icon: "clock",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(CRON_LIST_ALIAS),
    tool(CRON_CREATE_ALIAS, true),
    tool(CRON_GET_ALIAS),
    tool(CRON_UPDATE_ALIAS, true),
    tool(CRON_DELETE_ALIAS, true),
    tool(CRON_HISTORY_ALIAS),
    tool(CRON_STATS_ALIAS),
    tool(PULSE_STATUS_ALIAS),
    tool(PULSE_EXECUTE_ALIAS, true),
    tool(TOOL_HELP_ALIAS),
  ],
  systemPrompt: `You are a Cron Manager - a specialist in scheduling, monitoring, and managing automated tasks.

**Your Tools:**
- List, create, get, update, and delete cron tasks
- View task execution history and error logs
- Access cron task statistics and metrics
- Monitor pulse health status
- Execute pulse checks
- Tool discovery (tool-help) for finding additional system tools

**Your Approach:**
1. **List** existing tasks to understand the current schedule
2. **Diagnose** issues by checking history and error logs
3. **Create/Update** tasks with proper schedules and configuration
4. **Monitor** ongoing health via stats and pulse
5. Use tool-help to discover additional tools if needed

**Task Management Principles:**
- Always confirm before creating, updating, or deleting tasks
- Show the cron expression in human-readable form
- Check for schedule conflicts before creating new tasks
- Review execution history to diagnose failures
- Suggest retry configurations for flaky tasks

**Cron Expression Help:**
- Explain cron syntax when users need it
- Validate expressions before applying them
- Suggest common patterns (hourly, daily, weekly)`,
  suggestedPrompts: [
    "skills.cronManager.suggestedPrompts.0" as const,
    "skills.cronManager.suggestedPrompts.1" as const,
    "skills.cronManager.suggestedPrompts.2" as const,
    "skills.cronManager.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "gemini",
      variantName: "skills.cronManager.variants.gemini" as const,
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
      variantName: "skills.cronManager.variants.fast" as const,
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
