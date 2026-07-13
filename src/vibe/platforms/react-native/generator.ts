import "server-only";

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";

import { parseError } from "next-vibe/core/utils/parse-error";
import { findFilesByName } from "next-vibe/tooling/generators/shared/scanner";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";

const PROJECT_ROOT = process.cwd();
const SOURCE_DIR = join(PROJECT_ROOT, "src/app/[locale]");
const TARGET_DIR = join(PROJECT_ROOT, "src/generated/app-native/[locale]");

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

function findFiles(dir: string, pattern: string): string[] {
  return findFilesByName(dir, pattern)
    .map((r: { fullPath: string }) => relative(dir, r.fullPath))
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
  const importPath = `@/app/[locale]${relativePath ? `/${relativePath}` : ""}/${kind}`;
  const wrapperPath = `@/vibe/platforms/react-native/nextjs-compat-wrapper`;
  if (kind === "page") {
    return `import { createPageWrapperWithImport } from "${wrapperPath}";\n${formatCall("createPageWrapperWithImport", importPath)}\n`;
  }
  return `import { createLayoutWrapperWithImport } from "${wrapperPath}";\n${formatCall("createLayoutWrapperWithImport", importPath)}\n`;
}

export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
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
    const rel = dirname(pageFile);
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
    const rel = dirname(layoutFile);
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
}
