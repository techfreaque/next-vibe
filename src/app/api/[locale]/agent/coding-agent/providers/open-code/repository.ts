/**
 * OpenCode Provider Config
 *
 * batch:       `opencode run "<prompt>" [--model <id>]`
 * interactive: `opencode` (launches TUI — cannot receive a prompt via args)
 */

import "server-only";

import type { ProviderConfig } from "../../repository";

export const openCodeConfig: ProviderConfig = {
  bin: "opencode",
  routeId: "coding-agent",
  batchArgs: (data) => [
    "run",
    data.prompt,
    ...(data.model ? ["--model", data.model] : []),
  ],
  interactiveArgs: (data) => (data.model ? ["--model", data.model] : []),
};
