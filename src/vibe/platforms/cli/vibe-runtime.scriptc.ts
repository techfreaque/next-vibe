/**
 * Vibe CLI Entry Point — scriptc (native, non-Bun) compile target
 *
 * Identical to vibe-runtime.ts minus the Bun-only plugin registration
 * (./runtime/cli-widget-plugin imports `bun`, which only exists under an
 * actual Bun host — a scriptc-compiled binary has no Bun runtime to
 * register it with). Everything reached from here is otherwise the exact
 * same platform-agnostic CLI surface `bun run vibe-runtime.ts` runs.
 */

import { writeFileSync } from "node:fs";

import { CLI_BINARY_NAME } from "./types/cli-target";

try {
  const subcmd = process.argv[2] ?? "cli";
  writeFileSync("/proc/self/comm", `${CLI_BINARY_NAME}-${subcmd}`.slice(0, 15));
} catch {
  // Non-Linux or permission denied - TODO: fix for all platforms
}

import { runCli } from "./runtime/run-cli";

runCli({ name: CLI_BINARY_NAME });
