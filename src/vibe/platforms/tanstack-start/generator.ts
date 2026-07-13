// Flat TanStack Start route generator.
// Scans src/_pages (pages/layouts) and src (route.ts) and
// emits dot-separated flat files into src/generated/app-tanstack/routes/.
// Flat convention: page.tsx → $locale.path.index.tsx, layout.tsx → $locale.path.tsx,
// route.ts → api.$locale.path.ts

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
import path, { join, relative, resolve } from "node:path";

import type { ApiSection } from "next-vibe/core/definition/endpoint-base";
import { parseError } from "next-vibe/core/utils/parse-error";
import {
  filterPlatformMarkers,
  PlatformMarker,
  type UserRoleValue,
} from "next-vibe/identity/roles/enum";
import { hasCustomDirective } from "next-vibe/tooling/generators/shared/custom-directive";
import { findFilesByName } from "next-vibe/tooling/generators/shared/scanner";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";

import { getApiDir, getUiDir } from "@/env/paths";

// Use POSIX dirname so segment splitting on "/" works on Windows too
const posixDirname = path.posix.dirname;

const WRAPPER_IMPORT = "../nextjs-compat-wrapper";

interface GenerationResult {
  created: string[];
  skipped: string[];
  errors: Array<{ file: string; error: string }>;
}

// Opaque branded type — we never read its fields, just pass it through TanStack's own APIs
interface GeneratorConfig {
  readonly __brand: "tanstack-router-generator-config";
}

// Lazy getters so Turbopack's NFT tracer doesn't follow process.cwd() at parse time
function projectRoot(): string {
  return process.cwd();
}
function uiDir(): string {
  return join(projectRoot(), "src/app/[locale]");
}
function apiDir(): string {
  return join(projectRoot(), "src");
}
function routesDir(): string {
  return join(projectRoot(), "src/generated/app-tanstack/routes");
}

function findFiles(dir: string, pattern: string): string[] {
  return findFilesByName(dir, pattern).map((r: { fullPath: string }) =>
    relative(dir, r.fullPath).replaceAll("\\", "/"),
  );
}

function writeIfNotCustom(outPath: string, content: string): boolean {
  if (hasCustomDirective(outPath)) {
    return false;
  }
  writeFileSync(outPath, content, "utf-8");
  return true;
}

function fileContent(filePath: string): string {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

function hasUseClientDirective(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  return fileContent(filePath)
    .split("\n")
    .slice(0, 5)
    .some((l) => {
      const t = l.trim();
      return t === '"use client"' || t === "'use client'";
    });
}

function hasSyncDefaultExport(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  const c = fileContent(filePath);
  return (
    /\bexport\s+default\s+function\s+\w/.test(c) &&
    !/\bexport\s+default\s+async\s+function\b/.test(c)
  );
}

function hasForceDynamic(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  return /\bexport\s+const\s+dynamic\s*=\s*["']force-dynamic["']/.test(
    fileContent(filePath),
  );
}

function hasTanstackLoaderExport(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  return /\bexport\s+(async\s+)?function\s+tanstackLoader\b/.test(
    fileContent(filePath),
  );
}

function hasParamsInLoader(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  return /\btanstackLoader\s*\(\s*\{[\s\S]{0,100}\bparams\b/.test(
    fileContent(filePath),
  );
}

function hasSearchParamsInLoader(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  return /\btanstackLoader\b[\s\S]{0,300}searchParams/.test(
    fileContent(filePath),
  );
}

function hasHttpExports(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false;
  }
  return /\bexport\s+(const\s+\{[^}]*(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)|(?:const\s+|async\s+function\s+|function\s+)?(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS))\b/.test(
    fileContent(filePath),
  );
}

function getCatchAllParamName(dir: string): string | null {
  for (const segment of dir.split("/")) {
    const m = /^\[\.\.\.(.+)\]$/.exec(segment);
    if (m) {
      return m[1];
    }
  }
  return null;
}

function convertSegment(segment: string): string {
  if (segment.startsWith("(") && segment.endsWith(")")) {
    return `_${segment.slice(1, -1)}`;
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

function buildPaths(
  dir: string,
  sourceDir: string,
  kind: "page" | "layout" | "api",
): { flatName: string; routePath: string; importPath: string } {
  const rawSegments = dir === "." ? [] : dir.split("/");
  const tsSegments = rawSegments
    .flatMap((s) =>
      s.includes(".") && !s.startsWith("[") ? s.split(".") : [s],
    )
    .map(convertSegment);
  const urlSegments = tsSegments.join("/");
  const localePrefix = "$locale";
  let routePath: string, flatName: string, importSuffix: string;
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
  const srcDirFromRoot = relative(projectRoot(), sourceDir)
    .replace(/\\/g, "/")
    .replace(/^src\//, "");
  const importPath =
    dir === "."
      ? `@/${srcDirFromRoot}/${importSuffix}`
      : `@/${srcDirFromRoot}/${dir}/${importSuffix}`;
  return { flatName, routePath, importPath };
}

function cleanupGeneratedFiles(dir: string): void {
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
      cleanupGeneratedFiles(fullPath);
      continue;
    }
    if (
      (!name.endsWith(".tsx") && !name.endsWith(".ts")) ||
      name === "__root.tsx"
    ) {
      continue;
    }
    try {
      const content = readFileSync(fullPath, "utf-8");
      if (
        content.startsWith("// AUTO-GENERATED") &&
        !hasCustomDirective(fullPath)
      ) {
        rmSync(fullPath);
      }
    } catch {
      /* ignore */
    }
  }
}

function emitRootRedirect(result: GenerationResult): void {
  const outPath = join(routesDir(), "index.tsx");
  const content = [
    `// AUTO-GENERATED - middleware handles locale redirect, this loader should never run.`,
    `import { createFileRoute } from "@tanstack/react-router";`,
    ``,
    `export const Route = createFileRoute("/")({`,
    `  loader: () => {`,
    `    // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax`,
    `    throw new Error("This should never be called - middleware should have redirected");`,
    `  },`,
    `  component: () => null,`,
    `});`,
    ``,
  ].join("\n");
  const rel = relative(projectRoot(), outPath).replace(/\\/g, "/");
  if (writeIfNotCustom(outPath, content)) {
    result.created.push(rel);
  } else {
    result.skipped.push(rel);
  }
}

// Format `createFileRoute("path")({...})` — break to multi-line if >80 chars.
// bodyLines have NO leading indent; fmtRouteBlock adds the appropriate indent.
function fmtRouteBlock(routePath: string, bodyLines: string[]): string {
  const withOpen = `export const Route = createFileRoute("${routePath}")(`;
  if (`${withOpen}{`.length <= 80) {
    // Short path: `({` on same line, body at 2-space indent
    return [
      `${withOpen}{`,
      ...bodyLines.map((l) => (l ? `  ${l}` : ``)),
      `});`,
    ].join("\n");
  }
  const noOpen = `export const Route = createFileRoute("${routePath}")`;
  if (noOpen.length < 80) {
    // Path fits alone: break as `("path")(\n  {\n    body at 4-space\n  },\n)`
    return [
      `${noOpen}(`,
      `  {`,
      ...bodyLines.map((l) => (l ? `    ${l}` : ``)),
      `  },`,
      `);`,
    ].join("\n");
  }
  // Path itself too long: break the path arg, body at 2-space indent
  return [
    `export const Route = createFileRoute(`,
    `  "${routePath}",`,
    `)({`,
    ...bodyLines.map((l) => (l ? `  ${l}` : ``)),
    `});`,
  ].join("\n");
}

// Format `await import("path")` inside a handler — break if inner line >80
function fmtAwaitImport(importPath: string, indent: string): string {
  const single = `${indent}const { tanstackLoader } = await import("${importPath}");`;
  if (single.length <= 80) {
    return single;
  }
  return `${indent}const { tanstackLoader } =\n${indent}  await import("${importPath}");`;
}

// Format `.inputValidator(...)` — break to multi-line if type arg is an object
function fmtInputValidator(inputType: string): string[] {
  const single = `  .inputValidator((data: ${inputType}) => data)`;
  if (single.length <= 80) {
    return [single];
  }
  // Object type: break it out
  return [
    `  .inputValidator(`,
    `    (data: {`,
    `      params: Record<string, string>;`,
    `      search: Record<string, string>;`,
    `    }) => data,`,
    `  )`,
  ];
}

// Returns the body indent that fmtRouteBlock will use for the given route path.
function routeBodyIndent(routePath: string): number {
  const withOpen = `export const Route = createFileRoute("${routePath}")(`;
  const noOpen = `export const Route = createFileRoute("${routePath}")`;
  if (`${withOpen}{`.length <= 80) {
    return 2;
  } // short path: normal `({`
  if (noOpen.length < 80) {
    return 4;
  } // medium path: `(\n  {\n    body\n  },\n)`
  return 2; // long path: broken arg, normal `({`
}

// Loader body lines (no leading indent — fmtRouteBlock adds `baseIndent` spaces)
// Continuation lines use 2 extra spaces relative to the loader key.
function fmtParamsLoader(baseIndent = 2): string[] {
  const single = `loader: ({ params }) => loadData({ data: params as Record<string, string> }),`;
  if (baseIndent + single.length <= 80) {
    return [single];
  }
  return [
    `loader: ({ params }) =>`,
    `  loadData({ data: params as Record<string, string> }),`,
  ];
}

function fmtSearchLoader(baseIndent = 2): string[] {
  const single = `loader: ({ params, deps: { search } }) => loadData({ data: { params: params as Record<string, string>, search } }),`;
  if (baseIndent + single.length <= 80) {
    return [single];
  }
  return [
    `loader: ({ params, deps: { search } }) =>`,
    `  loadData({ data: { params: params as Record<string, string>, search } }),`,
  ];
}

// Format server handlers inside the route body (lines at 0-relative indent)
// fmtRouteBlock will add 2 spaces to each, so account for that in length checks
function fmtServerHandlers(importPath: string): string[] {
  // Final rendered: `      () => import("...")` = 6 + content
  const singleImportLine = `    () => import("${importPath}"),`;
  if (2 + singleImportLine.length <= 80) {
    return [
      `server: {`,
      `  handlers: wrapNextApiRoute(`,
      singleImportLine,
      `  ),`,
      `},`,
    ];
  }
  // Long: break `() =>` and `import("...")` onto separate lines
  return [
    `server: {`,
    `  handlers: wrapNextApiRoute(`,
    `    () =>`,
    `      import("${importPath}"),`,
    `  ),`,
    `},`,
  ];
}

function emitLayoutFile(
  dir: string,
  srcFile: string,
  sourceDir: string,
  result: GenerationResult,
): void {
  const { flatName, routePath, importPath } = buildPaths(
    dir,
    sourceDir,
    "layout",
  );
  const outPath = join(routesDir(), `${flatName}.tsx`);
  const srcRelative = relative(projectRoot(), srcFile).replace(/\\/g, "/");
  const hasTanstackLoader = hasTanstackLoaderExport(srcFile);
  const isClientComponent =
    hasUseClientDirective(srcFile) || hasSyncDefaultExport(srcFile);
  const staleTime = hasForceDynamic(srcFile) ? "0" : "Infinity";
  let content: string;
  if (hasTanstackLoader) {
    const hasSearch = hasSearchParamsInLoader(srcFile);
    const hasParams = hasParamsInLoader(srcFile);
    const lines = [
      `// AUTO-GENERATED from ${srcRelative}. Add "use custom" to this file to preserve customizations.`,
      `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
      `import { createServerFn } from "@tanstack/react-start";`,
      `import type { JSX } from "react";`,
      ``,
      `import { TanstackPage as Layout } from "${importPath}";`,
    ];
    if (hasParams || hasSearch) {
      lines.push(
        ``,
        `import { runPageLoader, toNextParams } from "${WRAPPER_IMPORT}";`,
      );
    } else {
      lines.push(``, `import { runPageLoader } from "${WRAPPER_IMPORT}";`);
    }
    if (hasParams || hasSearch) {
      lines.push(
        ``,
        `const loadData = createServerFn({ method: "GET" })`,
        ...fmtInputValidator(
          hasSearch
            ? "{ params: Record<string, string>; search: Record<string, string> }"
            : "Record<string, string>",
        ),
        `  .handler(async ({ data }) =>`,
        `    runPageLoader(async () => {`,
        fmtAwaitImport(importPath, `      `),
        `      return tanstackLoader({ params: Promise.resolve(toNextParams(${hasSearch ? "data.params" : "data"}))${hasSearch ? ", searchParams: Promise.resolve(data.search)" : ""} });`,
        `    }),`,
        `  );`,
      );
    } else {
      lines.push(
        ``,
        `const loadData = createServerFn({ method: "GET" }).handler(async () =>`,
        `  runPageLoader(async () => {`,
        fmtAwaitImport(importPath, `    `),
        `    return tanstackLoader();`,
        `  }),`,
        `);`,
      );
    }
    const bodyIndent = routeBodyIndent(routePath);
    const routeBodyLines = [
      `staleTime: ${staleTime},`,
      ...(hasSearch
        ? [
            `validateSearch: (search: Record<string, string>) => search,`,
            `loaderDeps: ({ search }) => ({ search }),`,
            ...fmtSearchLoader(bodyIndent),
          ]
        : hasParams
          ? [...fmtParamsLoader(bodyIndent)]
          : [`loader: () => loadData(),`]),
      `component: LayoutComponent,`,
    ];
    lines.push(
      ``,
      `function LayoutComponent(): JSX.Element {`,
      `  return (`,
      `    <Layout {...Route.useLoaderData()}>`,
      `      <Outlet />`,
      `    </Layout>`,
      `  );`,
      `}`,
      ``,
      fmtRouteBlock(routePath, routeBodyLines),
      ``,
    );
    content = lines.join("\n");
  } else if (isClientComponent) {
    content = [
      `// AUTO-GENERATED from ${srcRelative}. Add "use custom" to this file to preserve customizations.`,
      `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
      `import Layout from "${importPath}";`,
      ``,
      `export const Route = createFileRoute("${routePath}")({`,
      `  component: () => <Layout><Outlet /></Layout>,`,
      `});`,
      ``,
    ].join("\n");
  } else {
    content = [
      `// AUTO-GENERATED from ${srcRelative}. Add "use custom" to this file to preserve customizations.`,
      `import { createFileRoute, Outlet } from "@tanstack/react-router";`,
      ``,
      `export const Route = createFileRoute("${routePath}")({`,
      `  component: Outlet,`,
      `});`,
      ``,
    ].join("\n");
  }
  if (writeIfNotCustom(outPath, content)) {
    result.created.push(relative(projectRoot(), outPath).replace(/\\/g, "/"));
  }
}

function emitPageFile(
  dir: string,
  srcFile: string,
  sourceDir: string,
  result: GenerationResult,
): void {
  const catchAllName = getCatchAllParamName(dir);
  let { flatName, routePath, importPath } = buildPaths(dir, sourceDir, "page");
  if (catchAllName) {
    flatName = flatName
      .replace(new RegExp(`\\.\\$${catchAllName}\\.index$`), ".$")
      .replace(new RegExp(`^\\$${catchAllName}\\.index$`), "$");
    routePath = routePath
      .replace(new RegExp(`/\\$${catchAllName}/$`), "/$")
      .replace(new RegExp(`/\\$${catchAllName}$`), "/$");
  }
  const outPath = join(routesDir(), `${flatName}.tsx`);
  const srcRelative = relative(projectRoot(), srcFile).replace(/\\/g, "/");
  const hasSearch = hasSearchParamsInLoader(srcFile);
  const lines = [
    `// AUTO-GENERATED from ${srcRelative}. Add "use custom" to this file to preserve customizations.`,
    `import { createFileRoute } from "@tanstack/react-router";`,
    `import { createServerFn } from "@tanstack/react-start";`,
  ];
  // Type imports: alphabetical by source ("next-vibe/..." before "react")
  if (catchAllName) {
    lines.push(
      `import type { CountryLanguage } from "next-vibe/core/i18n/core/config";`,
    );
  }
  lines.push(`import type { JSX } from "react";`);
  lines.push(
    ``,
    `import { TanstackPage as Page } from "${importPath}";`,
    ``,
    `import { runPageLoader, toNextParams } from "${WRAPPER_IMPORT}";`,
  );
  if (catchAllName) {
    const inputType = hasSearch
      ? "{ params: Record<string, string>; search: Record<string, string> }"
      : "Record<string, string>";
    const paramsExpr = hasSearch ? "data.params" : "data";
    lines.push(
      ``,
      `const loadData = createServerFn({ method: "GET" })`,
      ...fmtInputValidator(inputType),
      `  .handler(async ({ data }) =>`,
      `    runPageLoader(async () => {`,
      fmtAwaitImport(importPath, `      `),
      `      const p = toNextParams(${paramsExpr});`,
      `      return tanstackLoader({`,
      `        params: Promise.resolve({`,
      `          ...p,`,
      `          ${catchAllName}: (p["_splat"] ?? "").split("/").filter(Boolean),`,
      `        } as { locale: CountryLanguage; ${catchAllName}: string[] }),`,
      ...(hasSearch
        ? [`        searchParams: Promise.resolve(data.search),`]
        : []),
      `      });`,
      `    }),`,
      `  );`,
    );
  } else {
    const inputType = hasSearch
      ? "{ params: Record<string, string>; search: Record<string, string> }"
      : "Record<string, string>";
    lines.push(
      ``,
      `const loadData = createServerFn({ method: "GET" })`,
      ...fmtInputValidator(inputType),
      `  .handler(async ({ data }) =>`,
      `    runPageLoader(async () => {`,
      fmtAwaitImport(importPath, `      `),
    );
    if (hasSearch) {
      lines.push(
        `      return tanstackLoader({`,
        `        params: Promise.resolve(toNextParams(data.params)),`,
        `        searchParams: Promise.resolve(data.search),`,
        `      });`,
      );
    } else {
      lines.push(
        `      return tanstackLoader({ params: Promise.resolve(toNextParams(data)) });`,
      );
    }
    lines.push(`    }),`, `  );`);
  }

  // Route body lines at zero indent; fmtRouteBlock adds the appropriate indent
  const bodyIndent = routeBodyIndent(routePath);
  const routeBodyLines = [
    `staleTime: 0,`,
    ...(hasSearch
      ? [
          `validateSearch: (search: Record<string, string>) => search,`,
          `loaderDeps: ({ search }) => ({ search }),`,
          ...fmtSearchLoader(bodyIndent),
        ]
      : [...fmtParamsLoader(bodyIndent)]),
    `component: PageComponent,`,
  ];

  lines.push(
    ``,
    `function PageComponent(): JSX.Element {`,
    `  return <Page {...Route.useLoaderData()} />;`,
    `}`,
    ``,
    fmtRouteBlock(routePath, routeBodyLines),
    ``,
  );
  if (writeIfNotCustom(outPath, lines.join("\n"))) {
    result.created.push(relative(projectRoot(), outPath).replace(/\\/g, "/"));
  }
}

function emitApiFile(
  dir: string,
  srcFile: string,
  sourceDir: string,
  result: GenerationResult,
): void {
  const { flatName, routePath, importPath } = buildPaths(dir, sourceDir, "api");
  const outPath = join(routesDir(), `${flatName}.ts`);
  const srcRelative = relative(projectRoot(), srcFile).replace(/\\/g, "/");
  const content = [
    `// AUTO-GENERATED from ${srcRelative}. Add "use custom" to this file to preserve customizations.`,
    `import { createFileRoute } from "@tanstack/react-router";`,
    ``,
    `import { wrapNextApiRoute } from "${WRAPPER_IMPORT}";`,
    ``,
    fmtRouteBlock(routePath, fmtServerHandlers(importPath)),
    ``,
  ].join("\n");
  if (writeIfNotCustom(outPath, content)) {
    result.created.push(relative(projectRoot(), outPath).replace(/\\/g, "/"));
  }
}

async function regenerateRouteTree(result: GenerationResult): Promise<void> {
  const srcDirectory = join(projectRoot(), "src/generated/app-tanstack");
  try {
    const routerGeneratorPkg = "@tanstack/router-generator";
    const { Generator, getConfig } = (await import(
      /* turbopackIgnore: true */ /* webpackIgnore: true */ routerGeneratorPkg
    )) as {
      getConfig: (inlineConfig: {
        routesDirectory: string;
        generatedRouteTree: string;
      }) => GeneratorConfig;
      Generator: new (opts: { config: GeneratorConfig; root: string }) => {
        run: () => Promise<void>;
      };
    };
    const config = getConfig({
      routesDirectory: resolve(srcDirectory, "routes"),
      generatedRouteTree: resolve(srcDirectory, "routeTree.gen.ts"),
    });
    await new Generator({ config, root: projectRoot() }).run();
  } catch (error) {
    result.errors.push({
      file: "src/generated/app-tanstack/routeTree.gen.ts",
      error: parseError(error).message,
    });
  }
}

export async function generate(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  void ctx;
  const result: GenerationResult = { created: [], skipped: [], errors: [] };
  const ui = uiDir();
  const api = apiDir();
  const routes = routesDir();

  if (!existsSync(ui)) {
    return {
      summary: "tanstack routes (ui dir missing)",
      counts: { created: 0, skipped: 0 },
    };
  }

  mkdirSync(routes, { recursive: true });
  cleanupGeneratedFiles(routes);

  for (const relPath of findFiles(ui, "layout.tsx")) {
    const dir = posixDirname(relPath);
    if (dir === ".") {
      result.skipped.push(relPath);
      continue;
    }
    const srcFile = join(ui, relPath);
    if (hasCustomDirective(srcFile)) {
      result.skipped.push(relPath);
      continue;
    }
    try {
      emitLayoutFile(dir, srcFile, ui, result);
    } catch (error) {
      result.errors.push({ file: relPath, error: parseError(error).message });
    }
  }

  for (const relPath of findFiles(ui, "page.tsx")) {
    const dir = posixDirname(relPath);
    const srcFile = join(ui, relPath);
    if (hasCustomDirective(srcFile)) {
      result.skipped.push(relPath);
      continue;
    }
    try {
      emitPageFile(dir, srcFile, ui, result);
    } catch (error) {
      result.errors.push({ file: relPath, error: parseError(error).message });
    }
  }

  if (existsSync(api)) {
    for (const relPath of findFiles(api, "route.ts")) {
      const dir = posixDirname(relPath);
      const srcFile = join(api, relPath);
      if (hasCustomDirective(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      if (!hasHttpExports(srcFile)) {
        result.skipped.push(relPath);
        continue;
      }
      try {
        emitApiFile(dir, srcFile, api, result);
      } catch (error) {
        result.errors.push({ file: relPath, error: parseError(error).message });
      }
    }
  }

  emitRootRedirect(result);
  await regenerateRouteTree(result);

  if (result.errors.length > 0) {
    return {
      summary: `tanstack routes (${String(result.created.length)} created, ${String(result.errors.length)} errors)`,
      failed: result.errors.map((e) => `${e.file}: ${e.error}`).join("; "),
    };
  }
  return {
    summary: `tanstack routes (${String(result.created.length)} created, ${String(result.skipped.length)} skipped)`,
    counts: { created: result.created.length, skipped: result.skipped.length },
  };
}
