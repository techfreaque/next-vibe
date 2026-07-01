import "server-only";

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

import type { ResponseType } from "next-vibe/core/route/response.schema";
import { success } from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import { hasCustomDirective } from "next-vibe/tooling/generators/shared/custom-directive";

/**
 * Next.js app-structure generator.
 *
 * Emits re-export SHELLS into `src/generated/app/` that mirror the hand-written
 * Next source (`src/app/[locale]/**` pages/layouts and
 * `src/app/api/[locale]/**` routes). The source stays authoritative and Next
 * serves it directly today; this parallel generated tree proves the generator
 * and is the seam for a later inversion (flip source ↔ generated).
 *
 * Mirrors the tanstack generator's contract: AUTO-GENERATED header, `use custom`
 * opt-out, and — for the API side — the `api/` path prefix.
 *
 * Nested (not flat): Next App Router requires directory-nested page.tsx/route.ts,
 * so shells are written at `generated/app/[locale]/<path>/page.tsx` etc.
 */

const PROJECT_ROOT = process.cwd();
const UI_DIR = join(PROJECT_ROOT, "src", "app", "[locale]");
const API_DIR = join(PROJECT_ROOT, "src", "app", "api", "[locale]");
const OUT_ROOT = join(PROJECT_ROOT, "src", "generated", "app");
const OUT_UI = join(OUT_ROOT, "[locale]");
const OUT_API = join(OUT_ROOT, "api", "[locale]");

/** How a source file re-imports back to the authoritative source, via alias. */
function sourceAlias(absSrc: string): string {
  const rel = relative(join(PROJECT_ROOT, "src"), absSrc)
    .replaceAll("\\", "/")
    .replace(/\.tsx?$/, "");
  return `@/${rel}`;
}

export interface NextGenResult {
  success: boolean;
  created: string[];
  skipped: string[];
  errors: { file: string; error: string }[];
  message: string;
}

function findFiles(dir: string, target: string, out: string[] = []): string[] {
  if (!existsSync(dir)) {
    return out;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip generated + node_modules-like noise; the app trees are clean but be safe.
      if (entry.name === "node_modules" || entry.name.startsWith(".")) {
        continue;
      }
      findFiles(full, target, out);
    } else if (entry.name === target) {
      out.push(full);
    }
  }
  return out;
}

/** True when a route.ts declares HTTP method exports (real endpoint, not a shell). */
function hasHttpExports(file: string): boolean {
  let src: string;
  try {
    src = readFileSync(file, "utf8");
  } catch {
    return false;
  }
  return /export\s+(?:const|async\s+function|function)\s+(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/.test(
    src,
  );
}

/** Write only if the target isn't a user-customized ("use custom") file. */
function writeIfNotCustom(outPath: string, content: string): boolean {
  if (existsSync(outPath) && hasCustomDirective(outPath)) {
    return false;
  }
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content, "utf8");
  return true;
}

function shell(srcAbs: string, kind: "page" | "layout" | "route"): string {
  const srcRel = relative(PROJECT_ROOT, srcAbs).replaceAll("\\", "/");
  const alias = sourceAlias(srcAbs);
  // Re-export everything Next's App Router reads from the file: default export
  // (page/layout component) plus named route handlers + segment config exports.
  const header = `// AUTO-GENERATED from ${srcRel}. Add "use custom" to this file to preserve customizations.`;
  if (kind === "route") {
    return [header, `export * from "${alias}";`, ``].join("\n");
  }
  return [
    header,
    `export { default } from "${alias}";`,
    `export * from "${alias}";`,
    ``,
  ].join("\n");
}

export class GenerateNextAppRepository {
  static async generate(): Promise<ResponseType<NextGenResult>> {
    return await Promise.resolve(
      success(GenerateNextAppRepository.generateInternal()),
    );
  }

  static generateInternal(): NextGenResult {
    const created: string[] = [];
    const skipped: string[] = [];
    const errors: { file: string; error: string }[] = [];

    const emit = (
      srcFiles: string[],
      srcRoot: string,
      outRoot: string,
      kind: "page" | "layout" | "route",
      filter?: (f: string) => boolean,
    ): void => {
      for (const srcFile of srcFiles) {
        if (hasCustomDirective(srcFile)) {
          skipped.push(relative(PROJECT_ROOT, srcFile));
          continue;
        }
        if (filter && !filter(srcFile)) {
          skipped.push(relative(PROJECT_ROOT, srcFile));
          continue;
        }
        const rel = relative(srcRoot, srcFile);
        const outPath = join(outRoot, rel);
        try {
          if (writeIfNotCustom(outPath, shell(srcFile, kind))) {
            created.push(relative(PROJECT_ROOT, outPath));
          } else {
            skipped.push(relative(PROJECT_ROOT, outPath));
          }
        } catch (error) {
          errors.push({
            file: relative(PROJECT_ROOT, srcFile),
            error: parseError(error).message,
          });
        }
      }
    };

    // UI: pages + layouts → generated/app/[locale]/**
    emit(findFiles(UI_DIR, "page.tsx"), UI_DIR, OUT_UI, "page");
    emit(findFiles(UI_DIR, "layout.tsx"), UI_DIR, OUT_UI, "layout");
    // API: route.ts (only real endpoints) → generated/app/api/[locale]/**
    emit(
      findFiles(API_DIR, "route.ts"),
      API_DIR,
      OUT_API,
      "route",
      hasHttpExports,
    );

    return {
      success: errors.length === 0,
      created,
      skipped,
      errors,
      message: `Next app shells: ${String(created.length)} created, ${String(skipped.length)} skipped, ${String(errors.length)} errors`,
    };
  }
}
