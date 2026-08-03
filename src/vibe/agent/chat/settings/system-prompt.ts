/* eslint-disable i18next/no-literal-string */
import "server-only";

import { eq } from "drizzle-orm";
import type { SystemPromptFragment } from "../../ai-stream/system-prompt/types";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import { chatSettings } from "./db";

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const codingAgentSettingFragment: SystemPromptFragment = {
  id: "coding-agent-setting",
  placement: "leading",
  priority: 610,
  build: async (params) => {
    const { user } = params;

    if (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN)) {
      return null;
    }

    try {
      const rows = await db
        .select({ codingAgent: chatSettings.codingAgent })
        .from(chatSettings)
        .where(eq(chatSettings.userId, user.id))
        .limit(1);

      const codingAgent = rows[0]?.codingAgent ?? null;

      if (codingAgent === null) {
        return null;
      }
      if (codingAgent === "next-vibe-coder") {
        return `## Coding Agent

When delegating coding work, use the \`ai-run\` tool with the \`vibe-coder\` skill. Pass the full task description as the prompt. The vibe-coder skill carries the full project context and coding conventions.`;
      }

      return `## Coding Agent

When delegating coding work, use the \`coding-agent\` tool. Pass the full task description as the prompt.`;
    } catch {
      return null;
    }
  },
};
