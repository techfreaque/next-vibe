import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import { findFilesByName } from "../../core/generators/shared/scanner";
import type { GeneratorDefinition } from "../../core/generators/shared/shared-inputs";
import { parseError } from "../../core/utils/parse-error";

import { getSrcDir, getUiDir, VIBE_IMPORT_ALIAS } from "@/env/paths";

const SOURCE_DIR = getUiDir();
const TARGET_DIR = join(getSrcDir(), "generated/app-native/[locale]");

function hasCustomDirective(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  try {
    const lines = readFileSync(filePath, "utf-8").split("\n").slice(0, 10);
    return lines.some((l) => {
      const t = l.trim();
      return t === '"use custom"' || t === "'use custom'";
    });
  } catch {
    return false;
  }
}

/**
 * Relative paths are used both as import specifiers and matched against "/"
 * separators, so normalize away Windows backslashes at the boundary. A raw
 * backslash would otherwise land inside an import string as an escape sequence.
 */
function toPosix(p: string): string {
  return p.replaceAll("\\", "/");
}

function findFiles(dir: string, pattern: string): string[] {
  return findFilesByName(dir, pattern)
    .map((r: { fullPath: string }) => toPosix(relative(dir, r.fullPath)))
    .filter((p: string) => !p.includes("/i18n/"));
}

function formatCall(fnName: string, importPath: string): string {
  const singleLine = `export default ${fnName}(() => import("${importPath}"));`;
  if (singleLine.length <= 80) {
    return singleLine;
  }
  const innerLine = `  () => import("${importPath}"),`;
  if (innerLine.length <= 80) {
    return `export default ${fnName}(\n  () => import("${importPath}"),\n);`;
  }
  return `export default ${fnName}(\n  () =>\n    import("${importPath}"),\n);`;
}

function pageContent(relativePath: string, kind: "page" | "layout"): string {
  const importPath = `@/_pages${relativePath ? `/${relativePath}` : ""}/${kind}`;
  const wrapperPath = `${VIBE_IMPORT_ALIAS}/platforms/react-native/nextjs-compat-wrapper`;
  if (kind === "page") {
    return `import { createPageWrapperWithImport } from "${wrapperPath}";\n${formatCall("createPageWrapperWithImport", importPath)}\n`;
  }
  return `import { createLayoutWrapperWithImport } from "${wrapperPath}";\n${formatCall("createLayoutWrapperWithImport", importPath)}\n`;
}

export const generator: GeneratorDefinition = {
  key: "native-indexes",
  phase: "default",
  needs: {},
  cacheKey: "native-indexes",
  findInputs(live) {
    const pagesDir = getUiDir();
    if (live) {
      return [
        ...live.routeFiles,
        ...findFilesByName(pagesDir, "page.tsx").map(
          (r: { fullPath: string }) => r.fullPath,
        ),
        ...findFilesByName(pagesDir, "layout.tsx").map(
          (r: { fullPath: string }) => r.fullPath,
        ),
      ].toSorted();
    }
    return [
      ...findFilesByName(pagesDir, "page.tsx").map(
        (r: { fullPath: string }) => r.fullPath,
      ),
      ...findFilesByName(pagesDir, "layout.tsx").map(
        (r: { fullPath: string }) => r.fullPath,
      ),
    ].toSorted();
  },
  async generate(ctx) {
    void ctx;
    const created: string[] = [];
    const skipped: string[] = [];
    const errors: { file: string; error: string }[] = [];

    if (!existsSync(SOURCE_DIR)) {
      return {
        summary: "native indexes (source dir missing)",
        counts: { created: 0, skipped: 0 },
      };
    }

    mkdirSync(TARGET_DIR, { recursive: true });

    for (const pageFile of findFiles(SOURCE_DIR, "page.tsx")) {
      const rel = toPosix(dirname(pageFile));
      const targetPath = join(TARGET_DIR, rel, "index.tsx");
      try {
        if (hasCustomDirective(targetPath)) {
          skipped.push(rel);
          continue;
        }
        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(
          targetPath,
          pageContent(rel === "." ? "" : rel, "page"),
          "utf-8",
        );
        created.push(rel);
      } catch (error) {
        errors.push({ file: rel, error: parseError(error).message });
      }
    }

    for (const layoutFile of findFiles(SOURCE_DIR, "layout.tsx")) {
      const rel = toPosix(dirname(layoutFile));
      const targetPath = join(TARGET_DIR, rel, "_layout.tsx");
      try {
        if (hasCustomDirective(targetPath)) {
          skipped.push(rel);
          continue;
        }
        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(
          targetPath,
          pageContent(rel === "." ? "" : rel, "layout"),
          "utf-8",
        );
        created.push(rel);
      } catch (error) {
        errors.push({ file: rel, error: parseError(error).message });
      }
    }

    if (errors.length > 0) {
      return {
        summary: `native indexes (${String(created.length)} created, ${String(errors.length)} errors)`,
        failed: errors.map((e) => `${e.file}: ${e.error}`).join("; "),
      };
    }
    return {
      summary: `native indexes (${String(created.length)} created, ${String(skipped.length)} skipped)`,
      counts: { created: created.length, skipped: skipped.length },
    };
  },
};
