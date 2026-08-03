import { ChatModelId } from "../../../ai-stream/models";
import { DB_HEALTH_ALIAS } from "next-vibe/database/health/constants";
import { TOOL_HELP_ALIAS } from "next-vibe/help-tool/constants";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";
import { HEALTH_ALIAS } from "next-vibe/server/server/health/constants";
import { CRON_HISTORY_ALIAS } from "next-vibe/tasks/cron/history/constants";
import { CRON_STATS_ALIAS } from "next-vibe/tasks/cron/stats/constants";
import { PULSE_EXECUTE_ALIAS } from "next-vibe/tasks/pulse/execute/constants";
import { PULSE_HISTORY_ALIAS } from "next-vibe/tasks/pulse/history/constants";
import { PULSE_STATUS_ALIAS } from "next-vibe/tasks/pulse/status/constants";

import type { Skill } from "../../config";
import { tool } from "../../constants";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SkillCategory,
  SkillOwnershipType,
} from "../../enum";
import {
  AUDIO_VISION,
  IMAGE_GEN,
  MUSIC_GEN,
  STT,
  VIDEO_GEN,
  VOICE,
} from "../_shared/media-presets";

export const systemMonitorSkill: Skill = {
  id: "system-monitor",
  name: "skills.systemMonitor.name" as const,
  tagline: "skills.systemMonitor.tagline" as const,
  description: "skills.systemMonitor.description" as const,
  icon: "activity",
  category: SkillCategory.ASSISTANT,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(HEALTH_ALIAS),
    tool(PULSE_STATUS_ALIAS),
    tool(PULSE_EXECUTE_ALIAS),
    tool(PULSE_HISTORY_ALIAS),
    tool(DB_HEALTH_ALIAS),
    tool(CRON_STATS_ALIAS),
    tool(CRON_HISTORY_ALIAS),
    tool(TOOL_HELP_ALIAS),
  ],
  systemPrompt: `You are a System Monitor - an infrastructure health specialist.

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
    "skills.systemMonitor.suggestedPrompts.0" as const,
    "skills.systemMonitor.suggestedPrompts.1" as const,
    "skills.systemMonitor.suggestedPrompts.2" as const,
    "skills.systemMonitor.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "fast",
      variantName: "skills.systemMonitor.variants.fast" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.GEMINI_3_5_FLASH,
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
      voiceModelSelection: VOICE.maleDeep,
      sttModelSelection: STT.cheap,
      audioVisionModelSelection: AUDIO_VISION.cheap,
    },
    {
      id: "budget",
      variantName: "skills.systemMonitor.variants.budget" as const,
      modelSelection: {
        selectionType: ModelSelectionType.MANUAL,
        manualModelId: ChatModelId.CLAUDE_HAIKU_4_5,
        intelligenceRange: {
          min: IntelligenceLevel.QUICK,
          max: IntelligenceLevel.QUICK,
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
