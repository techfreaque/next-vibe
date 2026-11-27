import { createEnumOptions } from "next-vibe/unified-ui/_shared/enum";
import { z } from "zod";

import { scopedTranslation } from "./i18n";

// Enum values double as CLI input, API wire values and persisted metadata.
export const {
  enum: CodingAgentProvider,
  options: codingAgentProviderOptions,
} = createEnumOptions(scopedTranslation, {
  CLAUDE_CODE: "claude-code",
  OPEN_CODE: "open-code",
  CODEX: "codex",
  ANTIGRAVITY: "antigravity",
});

export const { enum: Sandbox, options: sandboxOptions } = createEnumOptions(
  scopedTranslation,
  {
    READ_ONLY: "read-only",
    WORKSPACE_WRITE: "workspace-write",
    FULL_ACCESS: "danger-full-access",
  },
);

export const { enum: AgentStatus } = createEnumOptions(scopedTranslation, {
  IDLE: "idle",
  RUNNING: "running",
  COMPLETED: "completed",
  INTERRUPTED: "interrupted",
  FAILED: "failed",
});

export const codingAgentProviderSchema = z.enum(CodingAgentProvider);
export const sandboxSchema = z.enum(Sandbox);
export const agentStatusSchema = z.enum(AgentStatus);
export const finishedStatusSchema = z.enum([
  AgentStatus.COMPLETED,
  AgentStatus.INTERRUPTED,
  AgentStatus.FAILED,
]);
export const successfulStatusSchema = z.enum([
  AgentStatus.COMPLETED,
  AgentStatus.INTERRUPTED,
]);
