/**
 * Bun runtime plugin: CLI overrides
 *
 * Registers the CLI widget plugin with the Bun runtime module resolver so that
 * `bun run vibe-runtime.ts` (non-bundled dev mode) applies the same
 * web/ui → cli/ui redirects as the bundled binary.
 *
 * For bundled builds, the plugin is passed via bunOptions.plugins in build.config.ts
 * and this file is NOT imported (allowing target: "node" builds).
 */

// Pre-cache JSX runtimes before NODE_ENV changes.
import "react/jsx-dev-runtime";
import "react/jsx-runtime";

import { resolve } from "node:path";

import { plugin } from "bun";

import { createCliWidgetPlugin } from "./cli-widget-plugin-factory";

plugin(
  createCliWidgetPlugin(
    // import.meta.dir = src/app/api/[locale]/system/unified-interface/cli
    // 6 levels up → src/   (packages/next-vibe-ui lives under src/)
    // Use resolve(import.meta.dir) instead of URL.pathname — on Windows,
    // URL.pathname returns /C:/... which path.resolve doubles to C:\C:\...
    resolve(import.meta.dir, "../../../../../../"),
  ),
);
