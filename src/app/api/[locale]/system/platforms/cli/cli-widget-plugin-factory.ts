/**
 * CLI widget plugin factory
 *
 * Returns a BunPlugin that redirects UI imports to their CLI counterparts:
 *
 * Rule 1: next-vibe/ui/web/{ui,hooks,utils}/* → cli/{ui,hooks,utils}/*
 *   Bun resolves tsconfig paths before plugins, so "next-vibe/ui/web/ui/foo"
 *   arrives as an absolute path to web/ui/foo.tsx in onLoad. We intercept
 *   there and serve the cli/ui counterpart's contents instead.
 *   Same for hooks/ and utils/ directories.
 *
 * Rule 2: Any *.tsx/*.ts file → if a *.cli.tsx/*.cli.ts sibling exists, use it.
 *   .tsx: handled in onLoad (must return content - Bun requires it).
 *   .ts:  handled in onResolve (path redirect) to avoid double-registering
 *         modules in Bun's ESM registry, which would break lazy require() calls.
 *
 * Accepts an explicit rootDir so the factory can be called from build configs
 * (where import.meta.dir differs from the cli/ directory).
 */

import { existsSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

import type { BunPlugin } from "bun";

const toPosix = (p: string): string => p.replaceAll("\\", "/");

/**
 * Rewrite relative imports in CLI file contents so they resolve correctly when
 * Bun loads them under the web file's path. Without this, `./tailwind-to-ink`
 * in cli/ui/div.tsx would be resolved relative to web/ui/ where it doesn't exist.
 */
function rebaseRelativeImports(
  contents: string,
  cliFilePath: string,
  webFilePath: string,
): string {
  const cliDir = toPosix(dirname(cliFilePath));
  const webDir = toPosix(dirname(webFilePath));
  return contents.replace(
    /(from\s+|import\s*\()(["'])(\.\.?\/[^"']+)(["'])/g,
    (
      fullMatch,
      keyword: string,
      q1: string,
      importPath: string,
      q2: string,
    ) => {
      void fullMatch;
      const absTarget = toPosix(resolve(cliDir, importPath));
      const rebased = toPosix(relative(webDir, absTarget));
      const rel = rebased.startsWith(".") ? rebased : `./${rebased}`;
      return `${keyword}${q1}${rel}${q2}`;
    },
  );
}

/**
 * @param _rootDir - Deprecated. Previously the project root, used to build the
 *   web/cli base paths. After the UI refactor these dirs live next to this
 *   factory (system/ui/{web,cli}), so bases are now derived from import.meta.dir
 *   and this param is ignored. Kept for call-site compatibility.
 */
export function createCliWidgetPlugin(_rootDir?: string): BunPlugin {
  // Param kept for call-site compatibility; bases are now derived from this
  // file's own location (see doc comment above).
  void _rootDir;
  // This factory lives at system/platforms/cli/. The UI mirrors live at
  // system/ui/{web,cli}. Deriving the bases from this file's own location makes
  // the redirect independent of each caller's (historically inconsistent)
  // rootDir argument - the reason CLI widgets stopped being swapped and web
  // components (Card/Accordion/Checkbox) leaked onto the CLI, crashing the
  // renderer on browser-only APIs like requestAnimationFrame.
  const UI_BASE = resolve(import.meta.dir, "../../ui");
  const WEB_BASE = toPosix(resolve(UI_BASE, "web"));
  const CLI_BASE = toPosix(resolve(UI_BASE, "cli"));
  // Directories where cli/ mirrors web/ structure
  const MIRRORED_DIRS = ["ui", "hooks", "utils", "lib"] as const;

  return {
    name: "cli-overrides", // eslint-disable-line i18next/no-literal-string
    target: "bun", // eslint-disable-line i18next/no-literal-string
    setup(build) {
      build.onLoad({ filter: /\.tsx$/ }, ({ path }) => {
        const posixPath = toPosix(path);
        // Rule 1: web/{ui,hooks,utils}/*.tsx → serve cli/{…}/*.{tsx,ts} contents
        for (const dir of MIRRORED_DIRS) {
          const webDir = `${WEB_BASE}/${dir}/`;
          if (posixPath.startsWith(webDir)) {
            const rel = posixPath.slice(webDir.length);
            const cliPath = resolve(`${CLI_BASE}/${dir}`, rel);
            // Try exact extension first, then alternate (.tsx↔.ts)
            if (existsSync(cliPath)) {
              return {
                contents: rebaseRelativeImports(
                  readFileSync(cliPath, "utf-8"),
                  cliPath,
                  path,
                ),
                loader: "tsx",
              }; // eslint-disable-line i18next/no-literal-string
            }
            // .tsx web file might have .ts CLI counterpart
            const altPath = cliPath.replace(/\.tsx$/, ".ts");
            if (altPath !== cliPath && existsSync(altPath)) {
              return {
                contents: rebaseRelativeImports(
                  readFileSync(altPath, "utf-8"),
                  altPath,
                  path,
                ),
                loader: "tsx",
              }; // eslint-disable-line i18next/no-literal-string
            }
            return { contents: readFileSync(path, "utf-8"), loader: "tsx" }; // eslint-disable-line i18next/no-literal-string
          }
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

      // Rule 1 (.ts): web/{hooks,utils}/*.ts → serve cli/{…}/*.ts contents
      // Narrow filter to only match files inside the web base directory
      const webBaseEscaped = WEB_BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // eslint-disable-line no-useless-escape
      const tsFilter = new RegExp(
        `${webBaseEscaped}/(hooks|utils|lib)/.*\\.ts$`,
      );
      build.onLoad({ filter: tsFilter }, ({ path }) => {
        const posixPath = toPosix(path);
        for (const dir of MIRRORED_DIRS) {
          const webDir = `${WEB_BASE}/${dir}/`;
          if (posixPath.startsWith(webDir)) {
            const rel = posixPath.slice(webDir.length);
            const cliPath = resolve(`${CLI_BASE}/${dir}`, rel);
            if (existsSync(cliPath)) {
              return {
                contents: rebaseRelativeImports(
                  readFileSync(cliPath, "utf-8"),
                  cliPath,
                  path,
                ),
                loader: "ts",
              }; // eslint-disable-line i18next/no-literal-string
            }
            // .ts web file might have .tsx CLI counterpart
            const altPath = `${cliPath}x`;
            if (existsSync(altPath)) {
              return {
                contents: rebaseRelativeImports(
                  readFileSync(altPath, "utf-8"),
                  altPath,
                  path,
                ),
                loader: "tsx",
              }; // eslint-disable-line i18next/no-literal-string
            }
          }
        }
        // No CLI counterpart - serve original
        return { contents: readFileSync(path, "utf-8"), loader: "ts" }; // eslint-disable-line i18next/no-literal-string
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
