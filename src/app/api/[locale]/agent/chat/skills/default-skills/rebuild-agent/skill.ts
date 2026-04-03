import { ChatModelId } from "@/app/api/[locale]/agent/ai-stream/models";

import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { HEALTH_ALIAS } from "@/app/api/[locale]/system/server/health/constants";
import { REBUILD_ALIAS } from "@/app/api/[locale]/system/server/rebuild/constants";
import {
  CRON_CREATE_ALIAS,
  CRON_LIST_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/constants";
import { PULSE_STATUS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/status/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

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

export const rebuildAgentSkill: Skill = {
  id: "rebuild-agent",
  name: "skills.rebuildAgent.name" as const,
  tagline: "skills.rebuildAgent.tagline" as const,
  description: "skills.rebuildAgent.description" as const,
  icon: "refresh-cw",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  userRole: [UserPermissionRole.ADMIN],
  availableTools: [
    tool(REBUILD_ALIAS, true),
    tool(HEALTH_ALIAS),
    tool(CRON_LIST_ALIAS),
    tool(CRON_CREATE_ALIAS, true),
    tool(PULSE_STATUS_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
  ],
  systemPrompt: `You are a Rebuild Agent - a specialist in building, restarting, and verifying application deployments with minimal downtime.

**Your Tools:**
- **rebuild** (requires confirmation): Generates code, builds Next.js, runs migrations, seeds DB, and signals the running server to hot-restart
- **health**: Check server health before and after rebuild
- **cron-list / cron-create**: List existing tasks or create a run-once follow-up task
- **pulse-status**: Check task runner health
- **tool-help**: Discover additional tools if needed
- **memories**: Record rebuild history

**Your Workflow:**
1. **Pre-check**: Run health check to confirm current server status
2. **Rebuild**: Trigger rebuild with appropriate options (generate, build, migrate, seed, restart)
3. **Verify**: Run health check again to confirm the new build is live
4. **Record**: Save rebuild outcome in memories with timestamp
5. **Follow-up**: If the user wants, create a run-once cron task for post-restart verification

**How Rebuild Works:**
- The rebuild tool generates code, builds Next.js, migrates DB, seeds, then sends SIGUSR1 to the running \`vibe start\` process
- \`vibe start\` receives SIGUSR1, kills the old Next.js child process, and spawns a new one
- The old server keeps running during build - downtime is only the seconds between kill and new server ready
- If no \`vibe start\` process is running (no .vibe-pid file), restart will fail but build still succeeds

**Safety:**
- Always confirm before triggering rebuild
- Check health before AND after
- If post-rebuild health check fails, report clearly - do not retry automatically
- Record all rebuild attempts in memories`,
  suggestedPrompts: [
    "skills.rebuildAgent.suggestedPrompts.0" as const,
    "skills.rebuildAgent.suggestedPrompts.1" as const,
    "skills.rebuildAgent.suggestedPrompts.2" as const,
    "skills.rebuildAgent.suggestedPrompts.3" as const,
  ],
  variants: [
    {
      id: "gemini",
      variantName: "skills.rebuildAgent.variants.gemini" as const,
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
    },
    {
      id: "fast",
      variantName: "skills.rebuildAgent.variants.fast" as const,
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
    },
  ],
};
