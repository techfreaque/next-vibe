#!/usr/bin/env bun

/**
 * Vibe CLI Entry Point
 */

// Register Bun plugin for CLI widget overrides BEFORE any other imports.
import "./cli-widget-plugin";
// Side-effect: registers global error sink so all logger.error() calls persist to error_logs
import "../shared/logger/error-persist";

import { runCli } from "./run-cli";

runCli({ name: "vibe" });
