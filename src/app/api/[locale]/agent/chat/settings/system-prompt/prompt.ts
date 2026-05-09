/* eslint-disable i18next/no-literal-string */
import type { SystemPromptFragment } from "@/app/api/[locale]/agent/ai-stream/repository/system-prompt/types";

export interface CodingAgentSettingData {
  /** null = default (claude-code) */
  codingAgent: "claude-code" | "open-code" | "next-vibe-coder" | null;
}

export const codingAgentSettingFragment: SystemPromptFragment<CodingAgentSettingData> =
  {
    id: "coding-agent-setting",
    placement: "leading",
    priority: 610,
    condition: (data) => data.codingAgent !== null,
    build: (data) => {
      if (data.codingAgent === "next-vibe-coder") {
        return `## Coding Agent

When delegating coding work, use the \`ai-run\` tool with the \`vibe-coder\` skill. Pass the full task description as the prompt. The vibe-coder skill carries the full project context and coding conventions.`;
      }

      return `## Coding Agent

When delegating coding work, use the \`coding-agent\` tool. Pass the full task description as the prompt.`;
    },
  };
