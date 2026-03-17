import { CLAUDE_CODE_ALIAS } from "@/app/api/[locale]/agent/claude-code/constants";
import { TOOL_HELP_ALIAS } from "@/app/api/[locale]/system/help/constants";
import { HEALTH_ALIAS } from "@/app/api/[locale]/system/server/health/constants";
import { UserPermissionRole } from "@/app/api/[locale]/user/user-roles/enum";

import { TtsVoice } from "../../../../text-to-speech/enum";
import { MEMORY_LIST_ALIAS } from "../../../memories/constants";
import { MEMORY_ADD_ALIAS } from "../../../memories/create/constants";
import type { Skill } from "../../config";
import { tool } from "../../config";
import { SkillCategory, SkillOwnershipType } from "../../enum";
import {
  ContentLevel,
  IntelligenceLevel,
  ModelSelectionType,
  ModelSortDirection,
  ModelSortField,
  SpeedLevel,
} from "../../enum";
import { envClient } from "@/config/env-client";

export const deploymentAgentSkill: Skill = {
  id: "deployment-agent",
  name: "skills.deploymentAgent.name" as const,
  tagline: "skills.deploymentAgent.tagline" as const,
  description: "skills.deploymentAgent.description" as const,
  icon: "rocket",
  category: SkillCategory.CODING,
  ownershipType: SkillOwnershipType.SYSTEM,
  voice: TtsVoice.MALE,
  userRole: envClient.NEXT_PUBLIC_LOCAL_MODE ? [UserPermissionRole.ADMIN] : [],
  availableTools: [
    tool(CLAUDE_CODE_ALIAS),
    tool(HEALTH_ALIAS),
    tool(TOOL_HELP_ALIAS),
    tool(MEMORY_LIST_ALIAS),
    tool(MEMORY_ADD_ALIAS),
  ],
  systemPrompt: `You are a Deployment Agent — a specialist in builds, releases, and server management. Available on Hermes only.

**Your Tools:**
- Claude Code for executing deployment scripts and SSH commands
- Server health check for pre/post-deployment verification
- Build tool for creating production builds
- Start tool for starting the production server
- Memories for tracking deployment history
- Tool discovery (tool-help) for finding additional SSH and system tools

**Important:** Use tool-help to discover SSH tools for direct server management if needed.

**Your Approach:**
1. **Verify** current system health before deploying
2. **Build** the application for production
3. **Deploy** using Claude Code or SSH tools
4. **Verify** health again after deployment
5. **Record** deployment in memories with timestamp and changes

**Deployment Principles:**
- Always check health before AND after deployment
- Build before deploying (never deploy unbuit code)
- Keep deployment records in memories
- Roll back if post-deployment health check fails
- Notify about any issues encountered during deployment

**Safety:**
- Confirm destructive actions before executing
- Always have a rollback plan
- Check for running processes before restarting
- Verify database migrations completed successfully`,
  suggestedPrompts: [
    "skills.deploymentAgent.suggestedPrompts.0" as const,
    "skills.deploymentAgent.suggestedPrompts.1" as const,
    "skills.deploymentAgent.suggestedPrompts.2" as const,
    "skills.deploymentAgent.suggestedPrompts.3" as const,
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
