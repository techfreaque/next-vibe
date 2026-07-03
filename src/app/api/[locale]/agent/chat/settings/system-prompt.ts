/* eslint-disable i18next/no-literal-string */
import "server-only";

import { eq } from "drizzle-orm";
import { db } from "next-vibe/database";
import { UserPermissionRole } from "next-vibe/identity/roles/enum";

import type {
  SystemPromptFragment,
  SystemPromptServerParams,
} from "@/app/api/[locale]/agent/ai-stream/system-prompt/types";

import { chatSettings } from "./db";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface CodingAgentSettingData {
  /** null = default (claude-code) */
  codingAgent: "claude-code" | "open-code" | "next-vibe-coder" | null;
}

// ─── Fragment ──────────────────────────────────────────────────────────────────

export const codingAgentSettingFragment: SystemPromptFragment<CodingAgentSettingData> =
  {
    id: "coding-agent-setting",
    placement: "leading",
    priority: 610,
    build: (data) => {
      if (data.codingAgent === null) {
        return null;
      }
      if (data.codingAgent === "next-vibe-coder") {
        return `## Coding Agent

When delegating coding work, use the \`ai-run\` tool with the \`vibe-coder\` skill. Pass the full task description as the prompt. The vibe-coder skill carries the full project context and coding conventions.`;
      }

      return `## Coding Agent

When delegating coding work, use the \`coding-agent\` tool. Pass the full task description as the prompt.`;
    },
  };

// ─── Server Loader ─────────────────────────────────────────────────────────────

export async function loadCodingAgentSettingData(
  params: SystemPromptServerParams,
): Promise<CodingAgentSettingData> {
  const { user } = params;

  if (user.isPublic || !user.roles.includes(UserPermissionRole.ADMIN)) {
    return { codingAgent: null };
  }

  try {
    const rows = await db
      .select({ codingAgent: chatSettings.codingAgent })
      .from(chatSettings)
      .where(eq(chatSettings.userId, user.id))
      .limit(1);

    return { codingAgent: rows[0]?.codingAgent ?? null };
  } catch {
    return { codingAgent: null };
  }
}
