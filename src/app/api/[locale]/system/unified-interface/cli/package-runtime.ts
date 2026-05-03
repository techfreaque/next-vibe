#!/usr/bin/env bun

/**
 * Package CLI Entry Point
 *
 * Thin entry point for standalone next-vibe packages (e.g. @next-vibe/checker).
 * Imports the scoped generated endpoint registry and passes it to runCli().
 *
 * The scoped endpoint.ts is generated at build time by the package-endpoint
 * generator and contains only the endpoints declared in the package manifest.
 * It is bundled into this binary by Bun.build - no runtime redirect needed.
 *
 * VIBE_PACKAGE_NAME and VIBE_PACKAGE_DEFAULT_ENDPOINT are replaced by Bun
 * `define` at build time with the literal values from the package manifest.
 */

// Register CLI widget plugin BEFORE any other imports.
import "./cli-widget-plugin";

// Scoped endpoint registry - bundled at build time from the generated files
import { getEndpoint } from "@/app/api/[locale]/system/generated/endpoint";

import { runCli } from "./run-cli";

// These are replaced by Bun `define` at build time.
declare const VIBE_PACKAGE_NAME: string;
declare const VIBE_PACKAGE_DEFAULT_ENDPOINT: string;

runCli({
  name: VIBE_PACKAGE_NAME,
  defaultEndpoint: VIBE_PACKAGE_DEFAULT_ENDPOINT || undefined,
  getEndpoint,
});
