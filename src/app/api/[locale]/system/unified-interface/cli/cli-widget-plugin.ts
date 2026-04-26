/**
 * Bun plugin: CLI overrides
 *
 * Rule 1: next-vibe-ui/ui/* → cli/ui/*
 *   Bun resolves tsconfig paths before plugins, so "next-vibe-ui/ui/foo"
 *   arrives as an absolute path to web/ui/foo.tsx in onLoad. We intercept
 *   there and serve the cli/ui counterpart's contents instead.
 *   All cli/ui files use absolute @/ imports so there are no relative
 *   import resolution issues when content is served at the web/ui path.
 *
 * Rule 2: Any *.tsx/*.ts file → if a *.cli.tsx/*.cli.ts sibling exists, use it.
 *   .tsx: handled in onLoad (must return content - Bun requires it).
 *   .ts:  handled in onResolve (path redirect) to avoid double-registering
 *         modules in Bun's ESM registry, which would break lazy require() calls.
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { plugin } from "bun";

// Pre-cache JSX runtimes before NODE_ENV changes.
import "react/jsx-dev-runtime";
import "react/jsx-runtime";

const WEB_UI_DIR = resolve(
  import.meta.dir,
  "../../../../../../packages/next-vibe-ui/web/ui",
);

const CLI_UI_DIR = resolve(
  import.meta.dir,
  "../../../../../../packages/next-vibe-ui/cli/ui",
);

// Paths that have already been served as cli overrides once.
// On second load of the same web/ui path (triggered by cli/ui re-exports back to web/ui),
// serve the real web/ui content to break the cycle.
const webUiAlreadyOverridden = new Set<string>();

plugin({
  name: "cli-overrides", // eslint-disable-line i18next/no-literal-string
  target: "bun", // eslint-disable-line i18next/no-literal-string
  setup(build) {
    // Rule 1 + Rule 2 (.tsx): intercept all *.tsx loads
    // onLoad for .tsx must always return content - Bun requires it.
    // This is safe for .tsx because those files are not in the lazy require() chain.
    build.onLoad({ filter: /\.tsx$/ }, ({ path }) => {
      // Rule 1: web/ui/*.tsx → serve cli/ui/*.tsx contents
      if (path.startsWith(`${WEB_UI_DIR}/`)) {
        const rel = path.slice(WEB_UI_DIR.length + 1);
        const cliPath = resolve(CLI_UI_DIR, rel);
        if (existsSync(cliPath)) {
          // First load: serve cli/ui contents (DOM-free)
          // Second load (from cli/ui re-exporting web/ui): serve real web/ui content.
          // This lets pure values like buttonVariants pass through without Radix crashing.
          if (webUiAlreadyOverridden.has(path)) {
            return { contents: readFileSync(path, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
          }
          webUiAlreadyOverridden.add(path);
          return { contents: readFileSync(cliPath, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
        }
        return { contents: readFileSync(path, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
      }

      // Rule 2: *.tsx → *.cli.tsx sibling
      const base = path.slice(0, -4);
      for (const ext of [".cli.tsx", ".cli.ts"] as const) {
        if (existsSync(base + ext)) {
          return { contents: readFileSync(base + ext, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
        }
      }
      return { contents: readFileSync(path, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
    });

    // Rule 2 (.ts): use onResolve to redirect path without touching Bun's module registry.
    // onLoad for .ts files would cause "Requested module is already fetched" errors because
    // serving content via onLoad double-registers modules that were already loaded via
    // lazy require() chains (e.g. i18n/index.ts → require("./de") vs ESM parent import).
    build.onResolve({ filter: /\.ts$/ }, ({ path, importer }) => {
      // Only intercept relative imports
      if (!path.startsWith(".") || !importer) {
        return undefined;
      }
      const abs = resolve(dirname(importer), path);
      for (const srcExt of ["", ".ts", ".tsx"] as const) {
        const full = abs + srcExt;
        if (!existsSync(full)) {
          continue;
        }
        const base = full.endsWith(".tsx")
          ? full.slice(0, -4)
          : full.endsWith(".ts")
            ? full.slice(0, -3)
            : full;
        for (const cliExt of [".cli.ts", ".cli.tsx"] as const) {
          if (existsSync(base + cliExt)) {
            return { path: base + cliExt };
          }
        }
        break;
      }
      return undefined;
    });
  },
});
