import "server-only";

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

import { parseError } from "next-vibe/core/utils/parse-error";
import { hasCustomDirective } from "next-vibe/tooling/generators/shared/custom-directive";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";

const PROJECT_ROOT = process.cwd();
const UI_DIR = join(PROJECT_ROOT, "src", "_pages");
const API_DIR = join(PROJECT_ROOT, "src");
// Directories inside src/ that contain framework/system code — not user API routes.
const API_EXCLUDE_DIRS = new Set([
  join(PROJECT_ROOT, "src", "vibe"),
  join(PROJECT_ROOT, "src", "_pages"),
  join(PROJECT_ROOT, "src", "_old"),
  join(PROJECT_ROOT, "src", "generated"),
]);
const OUT_ROOT = join(PROJECT_ROOT, "src", "generated", "app");
const OUT_UI = join(OUT_ROOT, "[locale]");
const OUT_API = join(OUT_ROOT, "api", "[locale]");

function sourceAlias(absSrc: string): string {
  const rel = relative(join(PROJECT_ROOT, "src"), absSrc)
    .replaceAll("\\", "/")
    .replace(/\.tsx?$/, "");
  return `@/${rel}`;
}

function findFiles(
  dir: string,
  target: string,
  out: string[] = [],
  excludeDirs?: Set<string>,
): string[] {
  if (!existsSync(dir)) {
    return out;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === "node_modules" ||
        entry.name.startsWith(".") ||
        excludeDirs?.has(full)
      ) {
        continue;
      }
      findFiles(full, target, out, excludeDirs);
    } else if (entry.name === target) {
      out.push(full);
    }
  }
  return out;
}

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

function emit(
  srcFiles: string[],
  srcRoot: string,
  outRoot: string,
  kind: "page" | "layout" | "route",
  created: string[],
  skipped: string[],
  errors: { file: string; error: string }[],
  filter?: (f: string) => boolean,
): void {
  for (const srcFile of srcFiles) {
    if (hasCustomDirective(srcFile)) {
      skipped.push(relative(PROJECT_ROOT, srcFile));
      continue;
    }
    if (filter && !filter(srcFile)) {
      skipped.push(relative(PROJECT_ROOT, srcFile));
      continue;
    }
    const outPath = join(outRoot, relative(srcRoot, srcFile));
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
}

export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  void ctx;
  const created: string[] = [];
  const skipped: string[] = [];
  const errors: { file: string; error: string }[] = [];

  // — UI: page.tsx, layout.tsx, and all special Next.js file types —
  emit(
    findFiles(UI_DIR, "page.tsx"),
    UI_DIR,
    OUT_UI,
    "page",
    created,
    skipped,
    errors,
  );
  emit(
    findFiles(UI_DIR, "layout.tsx"),
    UI_DIR,
    OUT_UI,
    "layout",
    created,
    skipped,
    errors,
  );
  emit(
    findFiles(API_DIR, "route.ts", [], API_EXCLUDE_DIRS),
    API_DIR,
    OUT_API,
    "route",
    created,
    skipped,
    errors,
    hasHttpExports,
  );

  if (errors.length > 0) {
    return {
      summary: `next-app shells (${String(created.length)} created, ${String(errors.length)} errors)`,
      failed: errors.map((e) => `${e.file}: ${e.error}`).join("; "),
    };
  }
  return {
    summary: `next-app shells (${String(created.length)} created, ${String(skipped.length)} skipped)`,
    counts: { created: created.length, skipped: skipped.length },
  };
}
