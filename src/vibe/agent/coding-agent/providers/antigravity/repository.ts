/**
 * Antigravity Provider Config (interactive terminal mode)
 *
 * Interactive: `agy "<prompt>" [--model <model>]`
 * Batch/persistent mode uses `agy acp` via `AntigravityRun`.
 */

import "server-only";

import type { ProviderConfig } from "../../repository";
import { DEFAULT_ANTIGRAVITY_MODEL } from "./run";

export const antigravityConfig: ProviderConfig = {
  bin: "agy",
  routeId: "coding-agent",
  batchArgs: (data) => [
    "-p",
    data.prompt,
    "--model",
    data.model ?? DEFAULT_ANTIGRAVITY_MODEL,
  ],
  interactiveArgs: (data) => [
    data.prompt,
    "--model",
    data.model ?? DEFAULT_ANTIGRAVITY_MODEL,
  ],
};
