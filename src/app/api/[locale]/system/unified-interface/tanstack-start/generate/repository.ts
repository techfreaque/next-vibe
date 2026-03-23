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

import type { TanstackT } from "../i18n";
import { scopedTranslation } from "../i18n";
import type { GenerateResponseOutput } from "./definition";

interface GenerationResult {
  created: string[];
  skipped: string[];
  errors: Array<{ file: string; error: string }>;
}

export class GenerateTanstackRoutesRepository {
  private static readonly PROJECT_ROOT: string = process.cwd();
  /** UI source dir: page.tsx + layout.tsx */
  private static readonly UI_DIR: string = join(
    GenerateTanstackRoutesRepository.PROJECT_ROOT,
    "src/app/[locale]",
  );
  /** API source dir: route.ts */
  private static readonly API_DIR: string = join(
    GenerateTanstackRoutesRepository.PROJECT_ROOT,
    "src/app/api/[locale]",
  );
  private static readonly ROUTES_DIR: string = join(
    GenerateTanstackRoutesRepository.PROJECT_ROOT,
    "src/app-tanstack/routes",
  );
  private static readonly WRAPPER_IMPORT: string =
    "@/app/api/[locale]/system/unified-interface/tanstack-start/nextjs-compat-wrapper";

  static async generateInternal(): Promise<
    ResponseType<GenerateResponseOutput>
  > {
    const { t } = scopedTranslation.scopedT(defaultLocale);
    return GenerateTanstackRoutesRepository.runGeneration(t);
  }

  static async generate(
    user: JwtPayloadType,
    t: TanstackT,
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
    return GenerateTanstackRoutesRepository.runGeneration(t);
  }

  private static async runGeneration(
    t: TanstackT,
  ): Promise<ResponseType<GenerateResponseOutput>> {
    try {
      if (!existsSync(GenerateTanstackRoutesRepository.UI_DIR)) {
        return fail({
          message: t("generate.post.errors.notFound.title"),
          errorType: ErrorResponseTypes.NOT_FOUND,
          messageParams: {
            error: t("generate.post.errors.notFound.description"),
          },
        });
      }

      const result = GenerateTanstackRoutesRepository.generateRoutes();

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

  private static generateRoutes(): GenerationResult {
    const result: GenerationResult = { created: [], skipped: [], errors: [] };

    // Ensure routes dir exists
    if (!existsSync(GenerateTanstackRoutesRepository.ROUTES_DIR)) {
      mkdirSync(GenerateTanstackRoutesRepository.ROUTES_DIR, {
        recursive: true,
      });
    }

    // Clean up previously generated files (those with AUTO-GENERATED header)
    GenerateTanstackRoutesRepository.cleanupGeneratedFiles(
      GenerateTanstackRoutesRepository.ROUTES_DIR,
      result,
    );

    // Scan UI source files (page.tsx + layout.tsx)
    const allLayouts = GenerateTanstackRoutesRepository.findFiles(
      GenerateTanstackRoutesRepository.UI_DIR,
      "layout.tsx",
    );
    const allPages = GenerateTanstackRoutesRepository.findFiles(
      GenerateTanstackRoutesRepository.UI_DIR,
      "page.tsx",
    );
    // Scan API source files (route.ts) - from api dir
    const allApiRoutes = existsSync(GenerateTanstackRoutesRepository.API_DIR)
      ? GenerateTanstackRoutesRepository.findFiles(
          GenerateTanstackRoutesRepository.API_DIR,
          "route.ts",
        )
      : [];

    // Generate layout files - track written flat names to skip duplicate route groups
    const writtenLayoutNames = new Set<string>();
    for (const relPath of allLayouts) {
      const dir = dirname(relPath);
      // Root layout (dir === ".") is handled by __root.tsx - skip it here
      if (dir === ".") {
        result.skipped.push(relPath);
        continue;
      }
      const srcFile = join(GenerateTanstackRoutesRepository.UI_DIR, relPath);
      if (GenerateTanstackRoutesRepository.hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      // Skip if this dir (after route group stripping) maps to an already-written flat name
      const { flatName } = GenerateTanstackRoutesRepository.buildPaths(
        dir,
        GenerateTanstackRoutesRepository.UI_DIR,
        "layout",
      );
      if (writtenLayoutNames.has(flatName)) {
        result.skipped.push(relPath);
        continue;
      }
      writtenLayoutNames.add(flatName);
      try {
        const outFile = GenerateTanstackRoutesRepository.emitLayoutFile(
          dir,
          srcFile,
          GenerateTanstackRoutesRepository.UI_DIR,
        );
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
      const srcFile = join(GenerateTanstackRoutesRepository.UI_DIR, relPath);
      if (GenerateTanstackRoutesRepository.hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      try {
        const outFile = GenerateTanstackRoutesRepository.emitPageFile(
          dir,
          srcFile,
          GenerateTanstackRoutesRepository.UI_DIR,
          writtenLayoutNames,
        );
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
      const srcFile = join(GenerateTanstackRoutesRepository.API_DIR, relPath);
      if (GenerateTanstackRoutesRepository.hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      if (!GenerateTanstackRoutesRepository.hasHttpExports(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      try {
        const outFile = GenerateTanstackRoutesRepository.emitApiFile(
          dir,
          srcFile,
          GenerateTanstackRoutesRepository.API_DIR,
        );
        if (outFile) {
          result.created.push(outFile);
        }
      } catch (error) {
        result.errors.push({ file: relPath, error: parseError(error).message });
      }
    }

    // Emit a root index route that redirects / → /<defaultLocale>/
    GenerateTanstackRoutesRepository.emitRootRedirect(defaultLocale, result);

    return result;
  }

  // ---------------------------------------------------------------------------
  // File emitters
  // ---------------------------------------------------------------------------

  /**
   * Emit a root index route that redirects / → /<defaultLocale>/
   */
  private static emitRootRedirect(
    locale: string,
    result: GenerationResult,
  ): void {
    const outPath = join(
      GenerateTanstackRoutesRepository.ROUTES_DIR,
      "index.tsx",
    );
    const content = [
      `// AUTO-GENERATED - redirects / to the default locale.`,
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
      relative(GenerateTanstackRoutesRepository.PROJECT_ROOT, outPath).replace(
        /\\/g,
        "/",
      ),
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
  private static emitLayoutFile(
    dir: string,
    srcFile: string,
    sourceDir: string,
  ): string | null {
    const { flatName, routePath, importPath } =
      GenerateTanstackRoutesRepository.buildPaths(dir, sourceDir, "layout");
    const outPath = join(
      GenerateTanstackRoutesRepository.ROUTES_DIR,
      `${flatName}.tsx`,
    );
    const srcRelative = relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      srcFile,
    ).replace(/\\/g, "/");

    const hasTanstackLoader =
      GenerateTanstackRoutesRepository.hasTanstackLoaderExport(srcFile);
    const isClientComponent =
      GenerateTanstackRoutesRepository.hasUseClientDirective(srcFile) ||
      GenerateTanstackRoutesRepository.hasSyncDefaultExport(srcFile);

    let content: string;
    if (hasTanstackLoader) {
      const hasSearch =
        GenerateTanstackRoutesRepository.hasSearchParamsInLoader(srcFile);
      const hasParams =
        GenerateTanstackRoutesRepository.hasParamsInLoader(srcFile);

      const layoutLines: string[] = [
        `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
        `import { lazy } from "react";`,
        `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
      ];

      if (hasParams || hasSearch) {
        layoutLines.push(
          `import { createServerFn } from "@tanstack/react-start";`,
          `import { toNextParams } from "${GenerateTanstackRoutesRepository.WRAPPER_IMPORT}";`,
        );
      } else {
        layoutLines.push(
          `import { createServerFn } from "@tanstack/react-start";`,
        );
      }

      layoutLines.push(
        ``,
        `const TanstackLayout = lazy(() => import("${importPath}").then((m) => ({ default: m.TanstackPage })));`,
        ``,
        `const loadData = createServerFn({ method: "GET" })`,
      );

      if (hasParams || hasSearch) {
        layoutLines.push(
          `  .inputValidator((data: ${hasSearch ? "{ params: Record<string, string>; search: Record<string, string> }" : "Record<string, string>"}) => data)`,
          `  .handler(async ({ data }) => {`,
          `    const { tanstackLoader } = await import("${importPath}");`,
          `    return tanstackLoader({ params: Promise.resolve(toNextParams(${hasSearch ? "data.params" : "data"}))${hasSearch ? ", searchParams: Promise.resolve(data.search)" : ""} });`,
          `  });`,
        );
      } else {
        layoutLines.push(
          `  .inputValidator((data: Record<string, string>) => data)`,
          `  .handler(async () => {`,
          `    const { tanstackLoader } = await import("${importPath}");`,
          `    return tanstackLoader();`,
          `  });`,
        );
      }

      layoutLines.push(``);

      if (hasSearch) {
        layoutLines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  validateSearch: (search: Record<string, string>) => search,`,
          `  loaderDeps: ({ search }) => ({ search }),`,
          `  loader: ({ params, deps: { search } }) => Promise.all([loadData({ data: { params: params as Record<string, string>, search } }), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => <TanstackLayout {...Route.useLoaderData()}><Outlet /></TanstackLayout>,`,
          `});`,
          ``,
        );
      } else if (hasParams) {
        layoutLines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  loader: ({ params }) => Promise.all([loadData({ data: params as Record<string, string> }), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => <TanstackLayout {...Route.useLoaderData()}><Outlet /></TanstackLayout>,`,
          `});`,
          ``,
        );
      } else {
        layoutLines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  loader: () => Promise.all([loadData(), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => <TanstackLayout {...Route.useLoaderData()}><Outlet /></TanstackLayout>,`,
          `});`,
          ``,
        );
      }

      content = layoutLines.join("\n");
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
      // Cannot be rendered directly in TanStack - use a transparent Outlet passthrough.
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
    return relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      outPath,
    ).replace(/\\/g, "/");
  }

  /**
   * Emit a TanStack Start page route file.
   * page.tsx at dir → routes/path.index.tsx (createFileRoute '/path/')
   */
  private static emitPageFile(
    dir: string,
    srcFile: string,
    sourceDir: string,
    writtenLayoutNames: Set<string> = new Set(),
  ): string | null {
    // Detect catch-all segment - Next.js [...name] maps to TanStack splat ($)
    const catchAllName =
      GenerateTanstackRoutesRepository.getCatchAllParamName(dir);

    let { flatName, routePath, importPath } =
      GenerateTanstackRoutesRepository.buildPaths(dir, sourceDir, "page");

    // For catch-all pages, override flat name/route to use TanStack splat ($)
    // instead of a named param (which only matches a single segment).
    // Splat routes are emitted as layout-style files (no .index suffix).
    // e.g. threads/[...path]/page.tsx → $locale.threads.$.tsx, route /$locale/threads/$
    if (catchAllName) {
      // Replace $catchAllName.index with $ (splat, no index suffix)
      flatName = flatName
        .replace(new RegExp(`\\.\\$${catchAllName}\\.index$`), ".$")
        .replace(new RegExp(`^\\$${catchAllName}\\.index$`), "$");
      routePath = routePath
        .replace(new RegExp(`/\\$${catchAllName}/$`), "/$")
        .replace(new RegExp(`/\\$${catchAllName}$`), "/$");
    }

    const outPath = join(
      GenerateTanstackRoutesRepository.ROUTES_DIR,
      `${flatName}.tsx`,
    );
    const srcRelative = relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      srcFile,
    ).replace(/\\/g, "/");

    const hasSearch =
      GenerateTanstackRoutesRepository.hasSearchParamsInLoader(srcFile);

    // Detect a skipped route-group layout that should wrap this page inline
    const skippedGroupLayoutImport =
      GenerateTanstackRoutesRepository.findSkippedGroupLayout(
        dir,
        sourceDir,
        writtenLayoutNames,
      );

    const lines = [
      `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
      `import { lazy } from "react";`,
      `import { createFileRoute } from "@tanstack/react-router";`,
      `import { createServerFn } from "@tanstack/react-start";`,
      `import { toNextParams } from "${GenerateTanstackRoutesRepository.WRAPPER_IMPORT}";`,
    ];

    if (skippedGroupLayoutImport) {
      lines.push(
        `import { TanstackPage as GroupLayout } from "${skippedGroupLayoutImport}";`,
      );
    }

    if (catchAllName) {
      // Splat route: params contains _splat (the joined path after the prefix)
      // We re-map _splat → the original catch-all param name as a string[] for Next.js
      const inputType = hasSearch
        ? "{ params: Record<string, string>; search: Record<string, string> }"
        : "Record<string, string>";
      const paramsExpr = hasSearch ? "data.params" : "data";
      lines.push(
        `import type { CountryLanguage } from "@/i18n/core/config";`,
        ``,
        `const TanstackPage = lazy(() => import("${importPath}").then((m) => ({ default: m.TanstackPage })));`,
        ``,
        `const loadData = createServerFn({ method: "GET" })`,
        `  .inputValidator((data: ${inputType}) => data)`,
        `  .handler(async ({ data }) => {`,
        `    const { tanstackLoader } = await import("${importPath}");`,
        `    const p = toNextParams(${paramsExpr});`,
        `    return tanstackLoader({`,
        `      params: Promise.resolve({`,
        `        ...p,`,
        `        ${catchAllName}: (p["_splat"] ?? "").split("/").filter(Boolean),`,
        `      } as { locale: CountryLanguage; ${catchAllName}: string[] }),`,
        hasSearch
          ? `      searchParams: Promise.resolve(data.search),`
          : `      searchParams: Promise.resolve({}),`,
        `    });`,
        `  });`,
        ``,
      );

      const componentJsx = skippedGroupLayoutImport
        ? `<GroupLayout><TanstackPage {...Route.useLoaderData()} /></GroupLayout>`
        : `<TanstackPage {...Route.useLoaderData()} />`;

      if (hasSearch) {
        lines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  validateSearch: (search: Record<string, string>) => search,`,
          `  loaderDeps: ({ search }) => ({ search }),`,
          `  loader: ({ params, deps: { search } }) => Promise.all([loadData({ data: { params: params as Record<string, string>, search } }), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => ${componentJsx},`,
          `});`,
          ``,
        );
      } else {
        lines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  loader: ({ params }) => Promise.all([loadData({ data: params as Record<string, string> }), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => ${componentJsx},`,
          `});`,
          ``,
        );
      }
    } else {
      // Normal (non-splat) page
      const inputType = hasSearch
        ? "{ params: Record<string, string>; search: Record<string, string> }"
        : "Record<string, string>";
      const handlerBody = hasSearch
        ? `    return tanstackLoader({ params: Promise.resolve(toNextParams(data.params)), searchParams: Promise.resolve(data.search) });`
        : `    return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });`;

      lines.push(
        ``,
        `const TanstackPage = lazy(() => import("${importPath}").then((m) => ({ default: m.TanstackPage })));`,
        ``,
        `const loadData = createServerFn({ method: "GET" })`,
        `  .inputValidator((data: ${inputType}) => data)`,
        `  .handler(async ({ data }) => {`,
        `    const { tanstackLoader } = await import("${importPath}");`,
        `    ${handlerBody}`,
        `  });`,
        ``,
      );

      const componentJsx = skippedGroupLayoutImport
        ? `<GroupLayout><TanstackPage {...Route.useLoaderData()} /></GroupLayout>`
        : `<TanstackPage {...Route.useLoaderData()} />`;

      if (hasSearch) {
        lines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  validateSearch: (search: Record<string, string>) => search,`,
          `  loaderDeps: ({ search }) => ({ search }),`,
          `  loader: ({ params, deps: { search } }) => Promise.all([loadData({ data: { params: params as Record<string, string>, search } }), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => ${componentJsx},`,
          `});`,
          ``,
        );
      } else {
        lines.push(
          `export const Route = createFileRoute("${routePath}")({`,
          `  staleTime: 0,`,
          `  loader: ({ params }) => Promise.all([loadData({ data: params as Record<string, string> }), import("${importPath}")]).then(([data]) => data),`,
          `  component: () => ${componentJsx},`,
          `});`,
          ``,
        );
      }
    }

    const content = lines.join("\n");

    writeFileSync(outPath, content, "utf-8");
    return relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      outPath,
    ).replace(/\\/g, "/");
  }

  /**
   * Emit a TanStack Start API route file.
   * route.ts at dir → routes/api.path.ts (createFileRoute '/api/path')
   */
  private static emitApiFile(
    dir: string,
    srcFile: string,
    sourceDir: string,
  ): string | null {
    const { flatName, routePath, importPath } =
      GenerateTanstackRoutesRepository.buildPaths(dir, sourceDir, "api");
    const outPath = join(
      GenerateTanstackRoutesRepository.ROUTES_DIR,
      `${flatName}.ts`,
    );
    const srcRelative = relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      srcFile,
    ).replace(/\\/g, "/");

    const content = [
      `// AUTO-GENERATED. Add "use custom" to ${srcRelative} to skip.`,
      `import { createFileRoute } from "@tanstack/react-router";`,
      `import { wrapNextApiRoute } from "${GenerateTanstackRoutesRepository.WRAPPER_IMPORT}";`,
      ``,
      `export const Route = createFileRoute("${routePath}")({`,
      `  server: { handlers: wrapNextApiRoute(() => import("${importPath}")) },`,
      `});`,
      ``,
    ].join("\n");

    writeFileSync(outPath, content, "utf-8");
    return relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      outPath,
    ).replace(/\\/g, "/");
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
  private static buildPaths(
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
      .map((s) => GenerateTanstackRoutesRepository.convertSegment(s))
      .filter((s): s is string => s !== null);

    const urlSegments = tsSegments.join("/");
    let routePath: string;
    let flatName: string;
    let importSuffix: string;

    // All routes live under /$locale - prepend it since discovery starts inside [locale]
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
    const srcDirFromRoot = relative(
      GenerateTanstackRoutesRepository.PROJECT_ROOT,
      sourceDir,
    )
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
   * Returns null for route groups - they have no URL representation.
   * [locale] is NOT stripped here - it becomes $locale in the route path.
   * Discovery already starts inside the [locale] folder, so [locale] only
   * appears if a segment literally named "[locale]" exists deeper in the tree
   * (shouldn't happen, but handled gracefully via the dynamic segment rule).
   */
  private static convertSegment(segment: string): string | null {
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

  /**
   * If `dir` contains a catch-all segment `[...name]`, returns the param name.
   * Used to generate correct splat param handling in the server function.
   */
  private static getCatchAllParamName(dir: string): string | null {
    for (const segment of dir.split("/")) {
      const m = /^\[\.\.\.(.+)\]$/.exec(segment);
      if (m) {
        return m[1];
      }
    }
    return null;
  }

  /**
   * Find a route-group layout that was skipped because its flat name collided
   * with a sibling (non-group) layout. Returns the import path of that layout,
   * or null if no such layout exists.
   *
   * For example, given dir = "user/(other)/login", this checks if
   * "user/(other)/layout.tsx" exists and would have been skipped because
   * "user/layout.tsx" already wrote the flat name "$locale.user".
   */
  private static findSkippedGroupLayout(
    dir: string,
    sourceDir: string,
    writtenLayoutNames: Set<string>,
  ): string | null {
    const segments = dir === "." ? [] : dir.split("/");
    // Walk from innermost to outermost ancestor looking for a route group with a layout
    for (let i = segments.length - 1; i >= 0; i--) {
      const seg = segments[i];
      if (!seg.startsWith("(") || !seg.endsWith(")")) {
        continue;
      }
      // Found a route group ancestor - check if it has a layout.tsx
      const groupDir = segments.slice(0, i + 1).join("/");
      const layoutFile = join(sourceDir, groupDir, "layout.tsx");
      if (!existsSync(layoutFile)) {
        continue;
      }
      // Compute what flat name this layout would have had
      const { flatName, importPath } =
        GenerateTanstackRoutesRepository.buildPaths(
          groupDir,
          sourceDir,
          "layout",
        );
      // If this flat name was already taken, this layout was skipped
      if (writtenLayoutNames.has(flatName)) {
        return importPath;
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /**
   * Remove auto-generated route files (identified by "// AUTO-GENERATED" header).
   * Preserves __root.tsx and manually written files.
   */
  private static cleanupGeneratedFiles(
    dir: string,
    result: GenerationResult,
  ): void {
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
        GenerateTanstackRoutesRepository.cleanupGeneratedFiles(
          fullPath,
          result,
        );
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

  private static hasCustomDirective(filePath: string): boolean {
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

  /**
   * Returns true if the layout has a sync (non-async) default export function.
   * Such layouts contain no server-only APIs and can be imported directly in TanStack.
   */
  private static hasSyncDefaultExport(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      // Matches: export default function Foo or export default function(
      // but NOT: export default async function
      return (
        /\bexport\s+default\s+function\s+\w/.test(content) &&
        !/\bexport\s+default\s+async\s+function\b/.test(content)
      );
    } catch {
      return false;
    }
  }

  private static hasUseClientDirective(filePath: string): boolean {
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

  private static hasTanstackLoaderExport(filePath: string): boolean {
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

  /**
   * Returns true if tanstackLoader accepts a params argument (i.e. uses { params } in its signature).
   * No-data layouts define tanstackLoader() with no args - those should be called without params.
   */
  private static hasParamsInLoader(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      // Match tanstackLoader({ or tanstackLoader( followed by { params within ~100 chars
      return /\btanstackLoader\s*\(\s*\{[\s\S]{0,100}\bparams\b/.test(content);
    } catch {
      return false;
    }
  }

  private static hasSearchParamsInLoader(filePath: string): boolean {
    if (!existsSync(filePath)) {
      return false;
    }
    try {
      const content = readFileSync(filePath, "utf-8");
      // Check if tanstackLoader function destructures searchParams from its argument
      return /\btanstackLoader\b[\s\S]{0,300}searchParams/.test(content);
    } catch {
      return false;
    }
  }

  private static hasHttpExports(filePath: string): boolean {
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

  private static findFiles(dir: string, pattern: string): string[] {
    return findFilesByName(dir, pattern).map((r) => relative(dir, r.fullPath));
  }
}
