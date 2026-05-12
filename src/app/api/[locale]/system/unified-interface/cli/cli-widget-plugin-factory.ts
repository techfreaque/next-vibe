/**
 * CLI widget plugin factory
 *
 * Returns a BunPlugin that redirects UI imports to their CLI counterparts:
 *
 * Rule 1: next-vibe-ui/ui/* → cli/ui/*
 *   Bun resolves tsconfig paths before plugins, so "next-vibe-ui/ui/foo"
 *   arrives as an absolute path to web/ui/foo.tsx in onLoad. We intercept
 *   there and serve the cli/ui counterpart's contents instead.
 *
 * Rule 2: Any *.tsx/*.ts file → if a *.cli.tsx/*.cli.ts sibling exists, use it.
 *   .tsx: handled in onLoad (must return content - Bun requires it).
 *   .ts:  handled in onResolve (path redirect) to avoid double-registering
 *         modules in Bun's ESM registry, which would break lazy require() calls.
 *
 * Accepts an explicit rootDir so the factory can be called from build configs
 * (where import.meta.dir differs from the cli/ directory).
 */

import type { BunPlugin } from "bun";
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const toPosix = (p: string): string => p.replaceAll("\\", "/");

/**
 * @param rootDir - Absolute path to the project root (used to resolve package dirs)
 */
export function createCliWidgetPlugin(rootDir: string): BunPlugin {
  const WEB_UI_DIR = toPosix(resolve(rootDir, "packages/next-vibe-ui/web/ui"));
  const CLI_UI_DIR = toPosix(resolve(rootDir, "packages/next-vibe-ui/cli/ui"));

  return {
    name: "cli-overrides", // eslint-disable-line i18next/no-literal-string
    target: "bun", // eslint-disable-line i18next/no-literal-string
    setup(build) {
      build.onLoad({ filter: /\.tsx$/ }, ({ path }) => {
        const posixPath = toPosix(path);
        // Rule 1: web/ui/*.tsx → serve cli/ui/*.tsx contents
        if (posixPath.startsWith(`${WEB_UI_DIR}/`)) {
          const rel = posixPath.slice(WEB_UI_DIR.length + 1);
          const cliPath = resolve(CLI_UI_DIR, rel);
          if (existsSync(cliPath)) {
            return { contents: readFileSync(cliPath, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
          }
          return { contents: readFileSync(path, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
        }

        // Rule 2: *.tsx → *.cli.tsx sibling
        const base = path.slice(0, -4);
        for (const ext of [".cli.tsx", ".cli.ts"] as const) {
          if (existsSync(base + ext)) {
            return {
              contents: readFileSync(base + ext, "utf-8"),
              loader: "tsx",
            }; // eslint-disable-line i18next/no-literal-string
          }
        }
        return { contents: readFileSync(path, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
      });

      // Rule 2 (.ts): use onResolve to redirect path without touching Bun's module registry.
      build.onResolve({ filter: /\.ts$/ }, ({ path, importer }) => {
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
  };
}
