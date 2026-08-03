#!/usr/bin/env bun

/**
 * Vibe CLI Entry Point
 */

// Set process name for system monitor / ps (must happen before any async work)
import { writeFileSync } from "node:fs";

import { CLI_BINARY_NAME } from "./types/cli-target";

try {
  const subcmd = process.argv[2] ?? "cli";
  writeFileSync("/proc/self/comm", `${CLI_BINARY_NAME}-${subcmd}`.slice(0, 15));
} catch {
  // Non-Linux or permission denied - TODO: fix for all platforms
}

// Register Bun plugin for CLI widget overrides BEFORE any other imports.
import "./runtime/cli-widget-plugin";

import { runCli } from "./runtime/run-cli";

runCli({ name: CLI_BINARY_NAME });
