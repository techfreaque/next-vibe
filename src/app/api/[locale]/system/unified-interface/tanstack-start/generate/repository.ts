/**
 * Generate TanStack Start route files
 *
 * Scans src/app/[locale] (UI) and src/app/api/[locale] (API) for
 * page.tsx, layout.tsx, and route.ts files, and emits flat per-route
 * files into src/app-tanstack/routes/ using TanStack Start's
 * dot-separated flat filename convention.
 *
 * Flat filename convention (dots = path separators):
 *   page.tsx    → path.to.segment.index.tsx   (route: /path/to/segment/)
 *   layout.tsx  → path.to.segment.tsx          (route: /path/to/segment)
 *   route.ts    → api.path.to.segment.ts       (route: /api/path/to/segment)
 *
 * Discovery starts inside the [locale] folder (UI_DIR/API_DIR), so [locale] never
 * appears in relative paths. Generated routes start with /$locale (TanStack param).
 * Supports future migration to flat src/app/ structure (no [locale] folder).
 *
 * The tanstackStart Vite plugin auto-scans these files and generates routeTree.gen.ts.
 */

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

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils";

import { findFilesByName } from "@/app/api/[locale]/system/unified-interface/shared/utils/scanner";
import type { JwtPayloadType } from "@/app/api/[locale]/user/auth/types";

import { defaultLocale } from "@/i18n/core/config";

import { scopedTranslation } from "../i18n";
import type { GenerateResponseOutput } from "./definition";

type ModuleT = ReturnType<typeof scopedTranslation.scopedT>["t"];

interface GenerationResult {
  created: string[];
  skipped: string[];
  errors: Array<{ file: string; error: string }>;
}

export interface GenerateTanstackRoutesRepository {
  generate(
    user: JwtPayloadType,
    t: ModuleT,
  ): Promise<ResponseType<GenerateResponseOutput>>;
  generateInternal(): Promise<ResponseType<GenerateResponseOutput>>;
}

class GenerateTanstackRoutesRepositoryImpl implements GenerateTanstackRoutesRepository {
  private readonly PROJECT_ROOT: string;
  /** UI source dir: page.tsx + layout.tsx */
  private readonly UI_DIR: string;
  /** API source dir: route.ts */
  private readonly API_DIR: string;
  private readonly ROUTES_DIR: string;
  private readonly WRAPPER_IMPORT: string;

  constructor() {
    this.PROJECT_ROOT = process.cwd();
    this.UI_DIR = join(this.PROJECT_ROOT, "src/app/[locale]");
    this.API_DIR = join(this.PROJECT_ROOT, "src/app/api/[locale]");
    this.ROUTES_DIR = join(this.PROJECT_ROOT, "src/app-tanstack/routes");
    this.WRAPPER_IMPORT =
      "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";
  }

  async generateInternal(): Promise<ResponseType<GenerateResponseOutput>> {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    return this.runGeneration(t);
  }

  async generate(
    user: JwtPayloadType,
    t: ModuleT,
  ): Promise<ResponseType<GenerateResponseOutput>> {
    if (!user?.id) {
      return fail({
        message: t("generate.post.errors.unauthorized.title"),
        errorType: ErrorResponseTypes.UNAUTHORIZED,
        messageParams: {
          error: t("generate.post.errors.unauthorized.description"),
        },
      });
    }
    return this.runGeneration(t);
  }

  private async runGeneration(
    t: ModuleT,
  ): Promise<ResponseType<GenerateResponseOutput>> {
    try {
      if (!existsSync(this.UI_DIR)) {
        return fail({
          message: t("generate.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t("generate.post.errors.notFound.description"),
          },
        });
      }

      const result = this.generateRoutes();

      const message = t("generate.post.success.description", {
        created: result.created.length,
        skipped: result.skipped.length,
        errors: result.errors.length,
      });

      return success({
        success: result.errors.length === 0,
        created: result.created,
        skipped: result.skipped,
        errors: result.errors,
        message,
      });
    } catch (error) {
      return fail({
        message: t("generate.post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: parseError(error).message },
      });
    }
  }

  // ---------------------------------------------------------------------------
  // Core generation
  // ---------------------------------------------------------------------------

  private generateRoutes(): GenerationResult {
    const result: GenerationResult = { created: [], skipped: [], errors: [] };

    // Ensure routes dir exists
    if (!existsSync(this.ROUTES_DIR)) {
      mkdirSync(this.ROUTES_DIR, { recursive: true });
    }

    // Clean up previously generated files (those with AUTO-GENERATED header)
    this.cleanupGeneratedFiles(this.ROUTES_DIR, result);

    // Scan UI source files (page.tsx + layout.tsx)
    const allLayouts = this.findFiles(this.UI_DIR, "layout.tsx");
    const allPages = this.findFiles(this.UI_DIR, "page.tsx");
    // Scan API source files (route.ts) — from api dir
    const allApiRoutes = existsSync(this.API_DIR)
      ? this.findFiles(this.API_DIR, "route.ts")
      : [];

    // Generate layout files
    for (const relPath of allLayouts) {
      const dir = dirname(relPath);
      // Root layout (dir === ".") is handled by __root.tsx — skip it here
      if (dir === ".") {
        result.skipped.push(relPath);
        continue;
      }
      const srcFile = join(this.UI_DIR, relPath);
      if (this.hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      try {
        const outFile = this.emitLayoutFile(dir, srcFile, this.UI_DIR);
        if (outFile) {
          result.created.push(outFile);
        }
      } catch (error) {
        result.errors.push({ file: relPath, error: parseError(error).message });
      }
    }

    // Generate page files
    for (const relPath of allPages) {
      const dir = dirname(relPath);
      const srcFile = join(this.UI_DIR, relPath);
      if (this.hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      try {
        const outFile = this.emitPageFile(dir, srcFile, this.UI_DIR);
        if (outFile) {
          result.created.push(outFile);
        }
      } catch (error) {
        result.errors.push({ file: relPath, error: parseError(error).message });
      }
    }

    // Generate API route files
    for (const relPath of allApiRoutes) {
      const dir = dirname(relPath);
      const srcFile = join(this.API_DIR, relPath);
      if (this.hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      if (!this.hasHttpExports(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      try {
        const outFile = this.emitApiFile(dir, srcFile, this.API_DIR);
        if (outFile) {
          result.created.push(outFile);
        }
      } catch (error) {
        result.errors.push({ file: relPath, error: parseError(error).message });
      }
    }

    // Emit a root index route that redirects / → /<defaultLocale>/
    this.emitRootRedirect(defaultLocale, result);

    return result;
  }

  // ---------------------------------------------------------------------------
  // File emitters
  // ---------------------------------------------------------------------------

  /**
   * Emit a root index route that redirects / → /<defaultLocale>/
   */
  private emitRootRedirect(locale: string, result: GenerationResult): void {
    const outPath = join(this.ROUTES_DIR, "index.tsx");
    const content = [
      `// AUTO-GENERATED — redirects / to the default locale.`,
      `import { createFileRoute, redirect } from "@tanstack/react-router";`,
      ``,
      `export const Route = createFileRoute("/")({`,
      `  loader: () => { throw redirect({ to: "/${locale}/", replace: true }); },`,
      `  component: () => null,`,
      `});`,
      ``,
    ].join("\n");
    writeFileSync(outPath, content, "utf-8");
    result.created.push(
      relative(this.PROJECT_ROOT, outPath).replace(/\\/g, "/"),
    );
  }

  /**
   * Emit a TanStack Start layout route file.
   * layout.tsx at dir → routes/path.tsx (createFileRoute '/path')
   *
   * Two variants:
   * - If layout exports `tanstackLoader` + `TanstackPage`: use createServerFn to call
   *   tanstackLoader server-side, lazy-import TanstackPage for client rendering.
   *   Server deps stay out of the client bundle because tanstackLoader is only called
   *   inside the createServerFn handler (stripped by the TanStack plugin on client),
   *   and TanstackPage itself has no server imports at module scope.
   * - Otherwise: simple Outlet wrapper that imports the default export directly.
   */
  private emitLayoutFile(
    dir: string,
    srcFile: string,
    sourceDir: string,
  ): string | null {
    const { flatName, routePath, importPath } = this.buildPaths(
      dir,
      sourceDir,
      "layout",
    );
    const outPath = join(this.ROUTES_DIR, `${flatName}.tsx`);
    const srcRelative = relative(this.PROJECT_ROOT, srcFile).replace(
      /\\/g,
      "/",
    );

    const hasTanstackLoader = this.hasTanstackLoaderExport(srcFile);
    const isClientComponent = this.hasUseClientDirective(srcFile);

    let content: string;
    if (hasTanstackLoader) {
      content = [
        `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
        `import { lazy } from "react";`,
        `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
        `import { createServerFn } from "@tanstack/react-start";`,
        `import { toNextParams } from "${this.WRAPPER_IMPORT}";`,
        ``,
        `const TanstackLayout = lazy(() => import("${importPath}").then((m) => ({ default: m.TanstackPage })));`,
        ``,
        `const loadData = createServerFn({ method: "GET" })`,
        `  .inputValidator((params: Record<string, string>) => params)`,
        `  .handler(async ({ data: params }) => {`,
        `    const { tanstackLoader } = await import("${importPath}");`,
        `    return tanstackLoader({ params: Promise.resolve(toNextParams(params)) });`,
        `  });`,
        ``,
        `export const Route = createFileRoute("${routePath}")({`,
        `  loader: ({ params }) => loadData({ data: params as Record<string, string> }),`,
        `  component: () => <TanstackLayout {...Route.useLoaderData()}><Outlet /></TanstackLayout>,`,
        `});`,
        ``,
      ].join("\n");
    } else if (isClientComponent) {
      // "use client" layout: safe to import and use directly as a wrapper.
      content = [
        `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
        `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
        `import Layout from "${importPath}";`,
        ``,
        `export const Route = createFileRoute("${routePath}")({`,
        `  component: () => <Layout><Outlet /></Layout>,`,
        `});`,
        ``,
      ].join("\n");
    } else {
      // Plain Next.js async server layout without tanstackLoader/TanstackPage.
      // Cannot be rendered directly in TanStack — use a transparent Outlet passthrough.
      content = [
        `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
        `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
        ``,
        `export const Route = createFileRoute("${routePath}")({`,
        `  component: Outlet,`,
        `});`,
        ``,
      ].join("\n");
    }

    writeFileSync(outPath, content, "utf-8");
    return relative(this.PROJECT_ROOT, outPath).replace(/\\/g, "/");
  }

  /**
   * Emit a TanStack Start page route file.
   * page.tsx at dir → routes/path.index.tsx (createFileRoute '/path/')
   */
  private emitPageFile(
    dir: string,
    srcFile: string,
    sourceDir: string,
  ): string | null {
    const { flatName, routePath, importPath } = this.buildPaths(
      dir,
      sourceDir,
      "page",
    );
    const outPath = join(this.ROUTES_DIR, `${flatName}.tsx`);
    const srcRelative = relative(this.PROJECT_ROOT, srcFile).replace(
      /\\/g,
      "/",
    );

    const content = [
      `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
      `import { lazy } from "react";`,
      `import { createFileRoute } from "@tanstack/react-router";`,
      `import { createServerFn } from "@tanstack/react-start";`,
      `import { toNextParams } from "${this.WRAPPER_IMPORT}";`,
      ``,
      `const TanstackPage = lazy(() => import("${importPath}").then((m) => ({ default: m.TanstackPage })));`,
      ``,
      `const loadData = createServerFn({ method: "GET" })`,
      `  .inputValidator((params: Record<string, string>) => params)`,
      `  .handler(async ({ data: params }) => {`,
      `    const { tanstackLoader } = await import("${importPath}");`,
      `    return tanstackLoader({ params: Promise.resolve(toNextParams(params)) });`,
      `  });`,
      ``,
      `export const Route = createFileRoute("${routePath}")({`,
      `  loader: ({ params }) => loadData({ data: params as Record<string, string> }),`,
      `  component: () => <TanstackPage {...Route.useLoaderData()} />,`,
      `});`,
      ``,
    ].join("\n");

    writeFileSync(outPath, content, "utf-8");
    return relative(this.PROJECT_ROOT, outPath).replace(/\\/g, "/");
  }

  /**
   * Emit a TanStack Start API route file.
   * route.ts at dir → routes/api.path.ts (createFileRoute '/api/path')
   */
  private emitApiFile(
    dir: string,
    srcFile: string,
    sourceDir: string,
  ): string | null {
    const { flatName, routePath, importPath } = this.buildPaths(
      dir,
      sourceDir,
      "api",
    );
    const outPath = join(this.ROUTES_DIR, `${flatName}.ts`);
    const srcRelative = relative(this.PROJECT_ROOT, srcFile).replace(
      /\\/g,
      "/",
    );

    const content = [
      `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
      `import { createFileRoute } from "@tanstack/react-router";`,
      `import { wrapNextApiRoute } from "${this.WRAPPER_IMPORT}";`,
      ``,
      `export const Route = createFileRoute("${routePath}")({`,
      `  server: { handlers: wrapNextApiRoute(() => import("${importPath}")) },`,
      `});`,
      ``,
    ].join("\n");

    writeFileSync(outPath, content, "utf-8");
    return relative(this.PROJECT_ROOT, outPath).replace(/\\/g, "/");
  }

  // ---------------------------------------------------------------------------
  // Path builders
  // ---------------------------------------------------------------------------

  /**
   * Build the flat filename, TanStack route path, and import path for a source file.
   *
   * @param dir       - Directory relative to sourceDir (e.g. "admin/threads")
   * @param sourceDir - Absolute path to the source root (UI_DIR or API_DIR)
   * @param kind      - "page" | "layout" | "api"
   */
  private buildPaths(
    dir: string,
    sourceDir: string,
    kind: "page" | "layout" | "api",
  ): { flatName: string; routePath: string; importPath: string } {
    // Convert dir segments to TanStack path segments, stripping route groups.
    // Directory names containing dots (e.g. "AGENT.md") are split on "." since dots in
    // Next.js directory names map to "/" in URL paths (same as TanStack flat file convention).
    const rawSegments = dir === "." ? [] : dir.split("/");
    const tsSegments = rawSegments
      .flatMap((s) =>
        s.includes(".") && !s.startsWith("[") ? s.split(".") : [s],
      )
      .map((s) => this.convertSegment(s))
      .filter((s): s is string => s !== null);

    const urlSegments = tsSegments.join("/");
    let routePath: string;
    let flatName: string;
    let importSuffix: string;

    // All routes live under /$locale — prepend it since discovery starts inside [locale]
    const localePrefix = "$locale";

    if (kind === "page") {
      routePath =
        tsSegments.length > 0
          ? `/${localePrefix}/${urlSegments}/`
          : `/${localePrefix}/`;
      flatName =
        tsSegments.length > 0
          ? `${localePrefix}.${tsSegments.join(".")}.index`
          : `${localePrefix}.index`;
      importSuffix = "page";
    } else if (kind === "layout") {
      routePath =
        tsSegments.length > 0
          ? `/${localePrefix}/${urlSegments}`
          : `/${localePrefix}`;
      flatName =
        tsSegments.length > 0
          ? `${localePrefix}.${tsSegments.join(".")}`
          : localePrefix;
      importSuffix = "layout";
    } else {
      routePath =
        tsSegments.length > 0
          ? `/api/${localePrefix}/${urlSegments}`
          : `/api/${localePrefix}`;
      flatName =
        tsSegments.length > 0
          ? `api.${localePrefix}.${tsSegments.join(".")}`
          : `api.${localePrefix}`;
      importSuffix = "route";
    }

    // Import path: @/ maps to src/, so strip the leading "src/" from the relative path
    const srcDirFromRoot = relative(this.PROJECT_ROOT, sourceDir)
      .replace(/\\/g, "/")
      .replace(/^src\//, "");
    const importPath =
      dir === "."
        ? `@/${srcDirFromRoot}/${importSuffix}`
        : `@/${srcDirFromRoot}/${dir}/${importSuffix}`;

    return { flatName, routePath, importPath };
  }

  /**
   * Convert a single Next.js path segment to a TanStack path segment.
   * Returns null for route groups — they have no URL representation.
   * [locale] is NOT stripped here — it becomes $locale in the route path.
   * Discovery already starts inside the [locale] folder, so [locale] only
   * appears if a segment literally named "[locale]" exists deeper in the tree
   * (shouldn't happen, but handled gracefully via the dynamic segment rule).
   */
  private convertSegment(segment: string): string | null {
    // Strip route groups like (group)
    if (segment.startsWith("(") && segment.endsWith(")")) {
      return null;
    }
    const catchAll = /^\[\.\.\.(.+)\]$/.exec(segment);
    if (catchAll) {
      return `$${catchAll[1]}`;
    }
    const dynamic = /^\[(.+)\]$/.exec(segment);
    if (dynamic) {
      return `$${dynamic[1]}`;
    }
    return segment;
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /**
   * Remove auto-generated route files (identified by "// AUTO-GENERATED" header).
   * Preserves __root.tsx and manually written files.
   */
  private cleanupGeneratedFiles(dir: string, result: GenerationResult): void {
    let names: string[];
    try {
      names = readdirSync(dir, { encoding: "utf-8" });
    } catch {
      return;
    }
    for (const name of names) {
      const fullPath = join(dir, name);
      let isDir = false;
      try {
        isDir = statSync(fullPath).isDirectory();
      } catch {
        continue;
      }
      if (isDir) {
        this.cleanupGeneratedFiles(fullPath, result);
        continue;
      }
      // Skip non-TS/TSX files and the root file
      if (
        (!name.endsWith(".tsx") && !name.endsWith(".ts")) ||
        name === "__root.tsx"
      ) {
        continue;
      }
      // Check for AUTO-GENERATED header and delete if found
      try {
        const content = readFileSync(fullPath, "utf-8");
        if (content.startsWith("// AUTO-GENERATED")) {
          rmSync(fullPath);
        }
      } catch {
        // ignore
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  private hasCustomDirective(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      return content
        .split("\n")
        .slice(0, 10)
        .some((line) => {
          const t = line.trim();
          return t === '"use custom"' || t === "'use custom'";
        });
    } catch {
      return false;
    }
  }

  private hasUseClientDirective(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      return content
        .split("\n")
        .slice(0, 5)
        .some((line) => {
          const t = line.trim();
          return t === '"use client"' || t === "'use client'";
        });
    } catch {
      return false;
    }
  }

  private hasTanstackLoaderExport(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      return /\bexport\s+(async\s+)?function\s+tanstackLoader\b/.test(content);
    } catch {
      return false;
    }
  }

  private hasHttpExports(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      // Match direct exports: export const GET, export async function POST, etc.
      // Also match destructured exports: export const { GET, POST } = endpointsHandler(...)
      return /\bexport\s+(const\s+\{[^}]*(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)|(?:const\s+|async\s+function\s+|function\s+)?(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS))\b/.test(
        content,
      );
    } catch {
      return false;
    }
  }

  private findFiles(dir: string, pattern: string): string[] {
    return findFilesByName(dir, pattern)
      .map((r) => relative(dir, r.fullPath))
      .filter((p) => !p.includes("/i18n/"));
  }
}

export const generateTanstackRoutesRepository =
  new GenerateTanstackRoutesRepositoryImpl();
