import "server-only";

import {
  existsSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";

import type { ApiSection } from "../../../../core/definition/endpoint-base";
import { coreEnv } from "../../../../core/env";
import { hasCustomDirective } from "../../../../core/generators/shared/custom-directive";
import type { GeneratorDefinition } from "../../../../core/generators/shared/shared-inputs";
import { writeFileIfChanged } from "../../../../core/generators/shared/utils";
import { parseError } from "../../../../core/utils/parse-error";
import { Environment } from "../../../../env/env-util";
import {
  filterPlatformMarkers,
  PlatformMarker,
  type UserRoleValue,
} from "../../../../identity/roles/enum";

import {
  getApiDir,
  getGeneratedDir,
  getNextAppDir,
  getSrcDir,
  getUiDir,
  getVibeDir,
} from "@/env/paths";

const PROJECT_ROOT = process.cwd();
const UI_DIR = getUiDir();
const API_DIR = getApiDir();
// Directories inside src/ that contain framework/system code — not user API routes.
const SRC_DIR = getSrcDir();
const API_EXCLUDE_DIRS = new Set([
  getVibeDir(),
  join(SRC_DIR, "_pages"),
  join(SRC_DIR, "_old"),
  getGeneratedDir(),
  getNextAppDir(),
  join(SRC_DIR, "env"),
  join(SRC_DIR, "i18n"),
]);
const OUT_ROOT = getNextAppDir();
const OUT_UI = join(OUT_ROOT, "[locale]");
const OUT_API = join(OUT_ROOT, "api", "[locale]");

// Special Next.js file names (beyond page/layout/route) that get re-export shells.
// Files that require "use client" are listed in CLIENT_REQUIRED.
const SPECIAL_FILES = [
  "error.tsx",
  "global-error.tsx",
  "not-found.tsx",
  "loading.tsx",
  "template.tsx",
  "default.tsx",
] as const;
const CLIENT_REQUIRED = new Set(["error.tsx", "global-error.tsx"]);

const IS_PROD = coreEnv.NODE_ENV === Environment.PRODUCTION;

// Returns true when a route should be excluded from the Next.js generated app.
// Reads allowedRoles from the evaluated definitionModules map (populated by the
// generator context after importing every definition.ts). Null entry (failed
// import) is treated as not-excluded to avoid silently dropping routes.
function isWebExcluded(
  routePath: string,
  definitionModules: Map<string, ApiSection | null>,
): boolean {
  const defPath = routePath.replace(/\/route\.ts$/, "/definition.ts");
  const def = definitionModules.get(defPath);
  // Unknown key → not in scan scope → treat as not excluded.
  if (def === undefined || def === null) {
    return false;
  }
  for (const method of Object.values(def)) {
    if (!method || typeof method !== "object" || !("allowedRoles" in method)) {
      continue;
    }
    const roles = (method as { allowedRoles: readonly UserRoleValue[] })
      .allowedRoles;
    const markers = filterPlatformMarkers(roles);
    if (markers.includes(PlatformMarker.WEB_OFF)) {
      return true;
    }
    // PRODUCTION_OFF only suppresses shell generation in actual prod builds;
    // dev/local-web still generates the shell so the endpoint is accessible.
    if (IS_PROD && markers.includes(PlatformMarker.PRODUCTION_OFF)) {
      return true;
    }
  }
  return false;
}

function sourceAlias(absSrc: string, outPath: string): string {
  const rel = relative(
    dirname(outPath),
    absSrc.replace(/\.tsx?$/, ""),
  ).replaceAll("\\", "/");
  return rel.startsWith(".") ? rel : `./${rel}`;
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
  return /export\s+(?:const\s+\{[^}]*|\s*(?:async\s+)?function\s+)(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b/.test(
    src,
  );
}

/**
 * Returns whether the shell is generator-owned (false only when a "use custom"
 * directive means we must preserve the file) — NOT whether bytes hit the disk.
 * The write itself is content-conditional: these shells land under `src/app/**`
 * which `getApiDir()` (= `src/`) scans as `route.ts` INPUT, so rewriting
 * identical bytes would bump mtime and re-dirty the gen-cache every run.
 */
function writeIfNotCustom(outPath: string, content: string): boolean {
  if (existsSync(outPath) && hasCustomDirective(outPath)) {
    return false;
  }
  writeFileIfChanged(outPath, content);
  return true;
}

type ShellKind = "page" | "layout" | "route" | "special";

function shell(
  srcAbs: string,
  outPath: string,
  kind: ShellKind,
  fileName?: string,
): string {
  const srcRel = relative(PROJECT_ROOT, srcAbs).replaceAll("\\", "/");
  const alias = sourceAlias(srcAbs, outPath);
  const header = `// AUTO-GENERATED from ${srcRel}. Add "use custom" to this file to preserve customizations.`;
  if (kind === "route") {
    return [header, `export * from "${alias}";`, ``].join("\n");
  }
  const needsUseClient =
    kind === "special" &&
    fileName !== undefined &&
    CLIENT_REQUIRED.has(fileName);
  const lines: string[] = [];
  if (needsUseClient) {
    lines.push(`"use client";`);
  }
  lines.push(
    header,
    `export { default } from "${alias}";`,
    `export * from "${alias}";`,
    ``,
  );
  return lines.join("\n");
}

function emit(
  srcFiles: string[],
  srcRoot: string,
  outRoot: string,
  kind: ShellKind,
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
    const fileName = srcFile.split("/").pop();
    const outPath = join(outRoot, relative(srcRoot, srcFile));
    try {
      if (writeIfNotCustom(outPath, shell(srcFile, outPath, kind, fileName))) {
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

// Remove AUTO-GENERATED shells whose source file no longer exists.
function cleanupStaleShells(
  outRoot: string,
  srcRoot: string,
  removed: string[],
): void {
  if (!existsSync(outRoot)) {
    return;
  }
  for (const entry of readdirSync(outRoot, { withFileTypes: true })) {
    const fullOut = join(outRoot, entry.name);
    if (entry.isDirectory()) {
      cleanupStaleShells(fullOut, join(srcRoot, entry.name), removed);
      continue;
    }
    if (!entry.name.endsWith(".tsx") && !entry.name.endsWith(".ts")) {
      continue;
    }
    let isDir = false;
    try {
      isDir = statSync(fullOut).isDirectory();
    } catch {
      continue;
    }
    if (isDir) {
      continue;
    }
    try {
      const content = readFileSync(fullOut, "utf8");
      if (
        !content.startsWith("// AUTO-GENERATED") ||
        hasCustomDirective(fullOut)
      ) {
        continue;
      }
    } catch {
      continue;
    }
    // Derive the source path and check it exists.
    const srcPath = join(srcRoot, entry.name);
    if (!existsSync(srcPath)) {
      try {
        rmSync(fullOut);
        removed.push(relative(PROJECT_ROOT, fullOut));
      } catch {
        /* ignore */
      }
    }
  }
}

// Emit the proxy.ts re-export at the generated app root.
function emitProxyShell(
  created: string[],
  skipped: string[],
  errors: { file: string; error: string }[],
): void {
  const srcFile = join(SRC_DIR, "proxy.ts");
  if (!existsSync(srcFile)) {
    return;
  }
  const outPath = join(OUT_ROOT, "proxy.ts");
  const srcRel = relative(PROJECT_ROOT, srcFile).replaceAll("\\", "/");
  const alias = sourceAlias(srcFile, outPath);
  const content = [
    `// AUTO-GENERATED from ${srcRel}. Add "use custom" to this file to preserve customizations.`,
    `export * from "${alias}";`,
    ``,
  ].join("\n");
  try {
    if (writeIfNotCustom(outPath, content)) {
      created.push(relative(PROJECT_ROOT, outPath));
    } else {
      skipped.push(relative(PROJECT_ROOT, outPath));
    }
  } catch (error) {
    errors.push({ file: srcRel, error: parseError(error).message });
  }
}

export const generator: GeneratorDefinition = {
  key: "next-app",
  phase: "default",
  needs: { definitionModules: true },
  cacheKey: "next-app",
  findInputs(live) {
    const specialFiles = [
      "error.tsx",
      "global-error.tsx",
      "not-found.tsx",
      "loading.tsx",
      "template.tsx",
      "default.tsx",
    ];
    const specials = specialFiles.flatMap((name) => findFiles(UI_DIR, name));
    if (live) {
      return [
        ...live.routeFiles,
        ...findFiles(UI_DIR, "page.tsx"),
        ...findFiles(UI_DIR, "layout.tsx"),
        ...specials,
      ].toSorted();
    }
    return [
      ...findFiles(API_DIR, "route.ts"),
      ...findFiles(UI_DIR, "page.tsx"),
      ...findFiles(UI_DIR, "layout.tsx"),
      ...specials,
    ].toSorted();
  },
  async generate(ctx) {
    const created: string[] = [];
    const skipped: string[] = [];
    const removed: string[] = [];
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
    for (const specialFile of SPECIAL_FILES) {
      emit(
        findFiles(UI_DIR, specialFile),
        UI_DIR,
        OUT_UI,
        "special",
        created,
        skipped,
        errors,
      );
    }

    // — API: route.ts shells, skipping WEB_OFF / PRODUCTION_OFF endpoints —
    emit(
      findFiles(API_DIR, "route.ts", [], API_EXCLUDE_DIRS),
      API_DIR,
      OUT_API,
      "route",
      created,
      skipped,
      errors,
      (f) => {
        if (!hasHttpExports(f)) {
          return false;
        }
        return !isWebExcluded(f, ctx.computed.definitionModules);
      },
    );

    // — proxy.ts at app root —
    emitProxyShell(created, skipped, errors);

    // — Stale shell cleanup —
    cleanupStaleShells(OUT_UI, UI_DIR, removed);
    // Also clean API stale shells (map generated/app/api/[locale] ↔ src/)
    cleanupStaleShells(OUT_API, API_DIR, removed);

    if (errors.length > 0) {
      return {
        summary: `next-app shells (${String(created.length)} created, ${String(removed.length)} removed, ${String(errors.length)} errors)`,
        failed: errors.map((e) => `${e.file}: ${e.error}`).join("; "),
      };
    }
    return {
      summary: `next-app shells (${String(created.length)} created, ${String(skipped.length)} skipped, ${String(removed.length)} removed)`,
      counts: {
        created: created.length,
        skipped: skipped.length,
        removed: removed.length,
      },
    };
  },
};
