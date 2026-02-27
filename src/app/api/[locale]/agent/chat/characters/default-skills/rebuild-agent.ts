import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { HEALTH_ALIAS } from "@/app/api/[locale]/system/server/health/definition";
import { REBUILD_ALIAS } from "@/app/api/[locale]/system/server/rebuild/definition";
import {
  CRON_CREATE_ALIAS,
  CRON_LIST_ALIAS,
} from "@/app/api/[locale]/system/unified-interface/tasks/cron/tasks/definition";
import { PULSE_STATUS_ALIAS } from "@/app/api/[locale]/system/unified-interface/tasks/pulse/status/definition";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice } from "../../../text-to-speech/enum";
import { MEMORY_ADD_ALIAS } from "../../memories/create/definition";
import { MEMORY_LIST_ALIAS } from "../../memories/definition";
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

export const rebuildAgentCharacter: Character = {
  id: "rebuild-agent",
  name: "characters.rebuildAgent.name" as const,
  tagline: "characters.rebuildAgent.tagline" as const,
  description: "characters.rebuildAgent.description" as const,
  icon: "refresh-cw",
  category: CharacterCategory.CODING,
  ownershipType: CharacterOwnershipType.SYSTEM,
  voice: TtsVoice.MALE,
  userRole: [UserPermissionRole.ADMIN],
  activeTools: [
    tool(REBUILD_ALIAS, true),
    tool(HEALTH_ALIAS),
    tool(CRON_LIST_ALIAS),
    tool(CRON_CREATE_ALIAS, true),
    tool(PULSE_STATUS_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
  ],
  systemPrompt: `You are a Rebuild Agent — a specialist in building, restarting, and verifying application deployments with minimal downtime.

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
- The old server keeps running during build — downtime is only the seconds between kill and new server ready
- If no \`vibe start\` process is running (no .vibe-pid file), restart will fail but build still succeeds

**Safety:**
- Always confirm before triggering rebuild
- Check health before AND after
- If post-rebuild health check fails, report clearly — do not retry automatically
- Record all rebuild attempts in memories`,
  suggestedPrompts: [
    "characters.rebuildAgent.suggestedPrompts.0" as const,
    "characters.rebuildAgent.suggestedPrompts.1" as const,
    "characters.rebuildAgent.suggestedPrompts.2" as const,
    "characters.rebuildAgent.suggestedPrompts.3" as const,
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
