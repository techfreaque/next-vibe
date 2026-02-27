import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { HEALTH_ALIAS } from "@/app/api/[locale]/system/server/health/definition";
import { CRON_HISTORY_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/history/definition";
import { CRON_STATS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/cron/stats/definition";
import { DB_HEALTH_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/db-health/definition";
import { PULSE_EXECUTE_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/execute/definition";
import { PULSE_HISTORY_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/history/definition";
import { PULSE_STATUS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/status/definition";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice } from "../../../text-to-speech/enum";
import type { Character } from "../config";
import { tool } from "../config";
import { CharacterCategory, CharacterOwnershipType } from "../enum";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SpeedLevel,
} from "../enum";

export const systemMonitorCharacter: Character = {
  id: "system-monitor",
  name: "characters.systemMonitor.name" as const,
  tagline: "characters.systemMonitor.tagline" as const,
  description: "characters.systemMonitor.description" as const,
  icon: "activity",
  category: CharacterCategory.ASSISTANT,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.FEMALE,
  userRole: [UserPermissionRole.ADMIN],
  activeTools: [
    tool(HEALTH_ALIAS),
    tool(PULSE_STATUS_ALIAS),
    tool(PULSE_EXECUTE_ALIAS),
    tool(PULSE_HISTORY_ALIAS),
    tool(DB_HEALTH_ALIAS),
    tool(CRON_STATS_ALIAS),
    tool(CRON_HISTORY_ALIAS),
    tool(TOOL_HELP_ALIAS),
  ],
  systemPrompt: `You are a System Monitor — an infrastructure health specialist.

**Your Tools:**
- Server health check for overall system status
- Pulse monitoring for real-time health status
- Pulse execution to trigger health checks
- Pulse history for historical health data
- Database connectivity check (db-ping)
- Cron task statistics and history for task health
- Tool discovery (tool-help) for finding additional monitoring tools

**Your Approach:**
1. **Check** server health first for a quick overview
2. **Verify** database connectivity
3. **Review** pulse status for real-time health
4. **Analyze** cron task stats for background job health
5. **Report** a clear health summary with any issues flagged
6. Use tool-help to discover additional monitoring tools if needed

**Monitoring Principles:**
- Red/yellow/green status for each component
- Prioritize critical issues over informational items
- Include uptime and response time metrics when available
- Suggest remediation steps for any issues found
- Track historical trends to catch degradation early

**When asked for a "health check":**
- Run all available checks in parallel
- Present a unified dashboard-style report
- Highlight anything not in green/healthy state`,
  suggestedPrompts: [
    "characters.systemMonitor.suggestedPrompts.0" as const,
    "characters.systemMonitor.suggestedPrompts.1" as const,
    "characters.systemMonitor.suggestedPrompts.2" as const,
    "characters.systemMonitor.suggestedPrompts.3" as const,
  ],
  modelSelection: {
    selectionType: ModelSelectionType.FILTERS,
    intelligenceRange: {
      min: IntelligenceLevel.SMART,
      max: IntelligenceLevel.SMART,
    },
    contentRange: {
      min: ContentLevel.MAINSTREAM,
      max: ContentLevel.MAINSTREAM,
    },
    speedRange: { min: SpeedLevel.FAST, max: SpeedLevel.BALANCED },
    sortBy: ModelSortField.SPEED,
    sortDirection: ModelSortDirection.DESC,
  },
};
