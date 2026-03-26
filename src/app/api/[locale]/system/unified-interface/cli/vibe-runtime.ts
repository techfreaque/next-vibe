#!/usr/bin/env bun

/**
 * Vibe CLI Entry Point
 */

// Set process name for system monitor / ps (must happen before any async work)
import { writeFileSync } from "node:fs";
try {
  const subcmd = process.argv[2] ?? "cli";
  writeFileSync("/proc/self/comm", `vibe-${subcmd}`.slice(0, 15));
} catch {
  // Non-Linux or permission denied — ignore
}

// Register Bun plugin for CLI widget overrides BEFORE any other imports.
import "./cli-widget-plugin";
// Side-effect: registers global error sink so all logger.error() calls persist to error_logs
import "../shared/logger/error-persist";

import { runCli } from "./run-cli";

runCli({ name: "vibe" });
