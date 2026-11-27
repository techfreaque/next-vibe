/**
 * Codex Provider Config (interactive terminal mode)
 *
 * Interactive: `codex "<prompt>" [-m <model>]`
 * Batch/persistent mode uses `codex app-server` via `AgentRun`.
 */

import "server-only";

import type { ProviderConfig } from "../../repository";

export const codexConfig: ProviderConfig = {
  bin: "codex",
  routeId: "coding-agent",
  batchArgs: (data) => [
    "exec",
    data.prompt,
    ...(data.model ? ["-m", data.model] : []),
  ],
  interactiveArgs: (data) => [
    data.prompt,
    ...(data.model ? ["-m", data.model] : []),
  ],
};
