/**
 * Claude Code Provider Config
 */

import "server-only";

import type { ProviderConfig } from "../../repository";

export const claudeCodeConfig: ProviderConfig = {
  bin: "claude",
  routeId: "coding-agent",
  batchArgs: (data) => [
    "-p",
    data.prompt,
    "--output-format",
    "text",
    "--dangerously-skip-permissions",
    ...(data.model ? ["--model", data.model] : []),
  ],
  interactiveArgs: (data) => [
    data.prompt,
    "--dangerously-skip-permissions",
    ...(data.model ? ["--model", data.model] : []),
  ],
  injectTaskContext: (args, taskId, mcpInstanceName) => {
    const modified = [...args];
    modified[0] = `${modified[0] ?? ""}\n\n[TASK CONTEXT] taskId=${taskId} - When the work is complete, call MCP tool "complete-task" on MCP server "${mcpInstanceName}" with taskId="${taskId}" and response={"output":"<full result text>"} - pass the complete result in the response object so the AI that launched you can see it.`;
    return modified;
  },
  spawnEnv: { CLAUDECODE: undefined },
};
