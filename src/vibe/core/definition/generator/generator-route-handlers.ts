/**
 * Route Handlers Generator Repository
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import "server-only";

import { readFile, writeFile } from "node:fs/promises";

import { GENERATED_DIR, VIBE_DIR } from "@/env/paths";

import { formatCount, formatWarning } from "../../../logger/formatters";
import type { EndpointLogger } from "../../../logger/types";
import { PATH_SEPARATOR } from "../../core-utils/path";
import type {
  GeneratorContext,
  GeneratorResult,
} from "../../generators/shared/shared-inputs";
import {
  extractNestedPath,
  extractPathKey,
  generateAbsoluteImportPath,
  generateFileHeader,
  getRelativeImportPath,
  stripProjectRoot,
  toImportUrl,
  toProjectRelativePath,
  writeGeneratedFile,
} from "../../generators/shared/utils";
import type { WidgetData } from "../../utils/json";
import type { ApiSection } from "../endpoint-base";
import type { PlatformMarkerValue } from "../../../identity/roles/enum";
import {
  filterPlatformMarkers,
  PlatformMarker,
  type UserRoleValue,
} from "../../../identity/roles/enum";
import { WsChannelsGenerator } from "./generator-ws-channels";

const OUTPUT_FILE = `${GENERATED_DIR}/routes/handlers.ts`;
const DEV_OUTPUT_FILE = `${GENERATED_DIR}/routes/handlers-dev.ts`;

/**
 * Where GenericHandlerBase actually lives. The emitted import resolves from the
 * generated file's directory, not this one — a hand-written "../../route/handler"
 * pointed at <generated>/route/handler, which does not exist.
 */
const HANDLER_MODULE = `${VIBE_DIR}/core/route/handler.ts`;

/**
 * Serialize path segments into the canonical single-line array literal used in
 * definitions: `["system", "generators", "endpoint"]`.
 */
function serializePathArray(segments: readonly string[]): string {
  return `[${segments.map((s) => JSON.stringify(s)).join(", ")}]`;
}

/**
 * Replace a stale declared `path` array literal in a definition's source with
 * the correct one. `staleLiteral` / `correctLiteral` are canonical single-line
 * forms (see {@link serializePathArray}); the definition on disk may spell the
 * stale array across multiple lines or with different quoting/spacing, so we
 * locate the `path:` array by scanning for its balanced closing bracket and
 * compare on parsed contents rather than raw text.
 */
/** Parse a JSON literal into a string[], or null if it isn't one. No `unknown`/`as`. */
function parseStringArray(literal: string): string[] | null {
  try {
    const parsed: WidgetData = JSON.parse(literal);
    if (Array.isArray(parsed) && parsed.every((s) => typeof s === "string")) {
      return parsed.filter((s): s is string => typeof s === "string");
    }
    return null;
  } catch {
    return null;
  }
}

function replacePathLiteral(
  source: string,
  staleLiteral: string,
  correctLiteral: string,
): string {
  const staleSegments = parseStringArray(staleLiteral) ?? [];
  const pathKey = /(^|[\s{,])path\s*:\s*\[/g;

  let match: RegExpExecArray | null;
  while ((match = pathKey.exec(source)) !== null) {
    const openIndex = source.indexOf("[", match.index);
    // Find the matching closing bracket for this array literal.
    let depth = 0;
    let closeIndex = -1;
    for (let i = openIndex; i < source.length; i++) {
      const ch = source[i];
      if (ch === "[") {
        depth++;
      } else if (ch === "]") {
        depth--;
        if (depth === 0) {
          closeIndex = i;
          break;
        }
      }
    }
    if (closeIndex === -1) {
      continue;
    }

    const literal = source.slice(openIndex, closeIndex + 1);
    const parsed: string[] | null = parseStringArray(
      literal.replaceAll(/,(\s*])/g, "$1"),
    );
    if (
      parsed !== null &&
      parsed.length === staleSegments.length &&
      parsed.every((seg, i) => seg === staleSegments[i])
    ) {
      return (
        source.slice(0, openIndex) +
        correctLiteral +
        source.slice(closeIndex + 1)
      );
    }
  }

  return source;
}

/**
 * Route Handlers Generator Repository Implementation
 */
/**
 * Generate route-handlers.ts + route-hot-paths.ts + ws-channels.ts. Consumes shared
 * route/definition file lists. Reconciles declared paths with the filesystem
 * (mutating definition.ts when stale). Fails closed (throws) if a subscribable WS
 * channel lacks a canSubscribe guard. Byte-identical to the former
 * tooling/generators/route-handlers.
 */
export async function generateRouteHandlers(
  ctx: GeneratorContext,
): Promise<GeneratorResult> {
  return RouteHandlersGenerator.run(ctx, OUTPUT_FILE, DEV_OUTPUT_FILE);
}

/** Returns true when a route's definition carries the given marker. */
function routeHasMarker(
  routeFile: string,
  definitionModules: Map<string, ApiSection | null>,
  marker: typeof PlatformMarkerValue,
): boolean {
  const defPath = routeFile.replace(/\/route\.ts$/, "/definition.ts");
  const def = definitionModules.get(defPath);
  if (!def) {
    return false;
  }
  for (const method of Object.values(def)) {
    if (!method || typeof method !== "object" || !("allowedRoles" in method)) {
      continue;
    }
    const roles = (method as { allowedRoles: readonly UserRoleValue[] })
      .allowedRoles;
    if (filterPlatformMarkers(roles).includes(marker)) {
      return true;
    }
  }
  return false;
}

class RouteHandlersGenerator {
  static async run(
    ctx: GeneratorContext,
    outputFile: string,
    devOutputFile: string,
  ): Promise<GeneratorResult> {
    const { logger } = ctx;
    const routeFiles = ctx.files.route;
    const definitionFiles = ctx.files.definition;
    const definitionModules = ctx.computed.definitionModules;

    logger.debug(`Found ${routeFiles.length} route files`);

    // Filter routes that have no matching definition
    const definitionFilesSet = new Set(definitionFiles);
    const routesWithoutDefinition: string[] = [];
    const validRouteFiles: string[] = [];

    for (const routeFile of routeFiles) {
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
      if (!definitionFilesSet.has(definitionPath)) {
        routesWithoutDefinition.push(routeFile);
      } else {
        validRouteFiles.push(routeFile);
      }
    }

    if (routesWithoutDefinition.length > 0) {
      const routeList = routesWithoutDefinition
        .map((r) => `    • ${stripProjectRoot(r)}`)
        .join("\n");
      logger.debug(
        formatWarning(
          `Skipped ${formatCount(routesWithoutDefinition.length, "route")} without matching definition:\n${routeList}`,
        ),
      );
    }

    // Reconcile declared paths with the filesystem before generating. The
    // filesystem location is the source of truth: a declared `path` that
    // diverges produces a route that 404s on the dev server (silent 200
    // HTML), which hangs any client read of that endpoint. Instead of failing
    // the build, rewrite the definition's `path` to match its directory.
    const fixedPaths = await RouteHandlersGenerator.reconcileDefinitionPaths(
      validRouteFiles,
      false,
    );
    for (const fix of fixedPaths) {
      logger.debug(formatWarning(fix));
    }

    // Prod routes: exclude PRODUCTION_OFF. Collect WEB_OFF routes for
    // bundle-ignore comments (they stay in the prod file but must not be
    // traced by the bundler).
    const prodRouteFiles: string[] = [];
    const webIgnoredImportPaths = new Set<string>();
    for (const routeFile of validRouteFiles) {
      if (
        routeHasMarker(
          routeFile,
          definitionModules,
          PlatformMarker.PRODUCTION_OFF,
        )
      ) {
        continue; // omit from prod file entirely
      }
      if (
        routeHasMarker(routeFile, definitionModules, PlatformMarker.WEB_OFF)
      ) {
        webIgnoredImportPaths.add(
          generateAbsoluteImportPath(routeFile, "route"),
        );
      }
      prodRouteFiles.push(routeFile);
    }

    // Generate prod file (no PRODUCTION_OFF; WEB_OFF gets ignore comments).
    const { content, hotPathsContent, routeCount } =
      await RouteHandlersGenerator.generateContent(
        prodRouteFiles,
        logger,
        outputFile,
        webIgnoredImportPaths,
      );

    const hotPathsFile = outputFile.replace(/\/handlers\.ts$/, "/hot-paths.ts");
    await writeGeneratedFile(outputFile, content, false);
    await writeGeneratedFile(hotPathsFile, hotPathsContent, false);

    // Generate dev file (all routes, no ignore comments).
    const {
      content: devContent,
      hotPathsContent: devHotPathsContent,
      routeCount: devRouteCount,
    } = await RouteHandlersGenerator.generateContent(
      validRouteFiles,
      logger,
      devOutputFile,
    );

    const devHotPathsFile = devOutputFile.replace(
      /\/handlers-dev\.ts$/,
      "/hot-paths-dev.ts",
    );
    await writeGeneratedFile(devOutputFile, devContent, false);
    await writeGeneratedFile(devHotPathsFile, devHotPathsContent, false);

    // Websocket channels and remote-event routes are an optional concern —
    // see generator-ws-channels.ts. It validates the channel guards and emits
    // both registries; a build without realtime never reaches this.
    const ws = await WsChannelsGenerator.run(
      validRouteFiles,
      outputFile,
      logger,
    );
    if (!ws.ok) {
      return {
        summary: "route handlers (failed: WS channel guards)",
        failed: `Route handlers generation failed (WS channel guards): ${ws.failed}`,
      };
    }

    return {
      summary: `route handlers (${routeCount} routes prod, ${devRouteCount} dev, ${ws.channelCount} channels)`,
      counts: {
        routes: routeCount,
        devRoutes: devRouteCount,
        channels: ws.channelCount,
      },
    };
  }

  // ─── Private helpers ────────────────────────────────────────────────────

  /**
   * Extract HTTP methods from definition file (async)
   * We extract from definition instead of route because route files have server-only dependencies
   */
  private static async extractMethodsFromDefinition(
    routeFile: string,
  ): Promise<string[]> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(toImportUrl(definitionPath))) as {
        default?: ApiSection;
      };
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        // Bun plugin race - yield then retry
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        defaultExport = definition.default;
      }

      if (!defaultExport) {
        return [];
      }

      // Get all HTTP methods from the definition
      const methods = Object.keys(defaultExport).filter((key) =>
        ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"].includes(
          key,
        ),
      );
      return methods;
    } catch {
      return [];
    }
  }

  /**
   * Extract aliases from definition file (async)
   */
  private static async extractAliasesFromDefinition(
    routeFile: string,
  ): Promise<Array<{ alias: string; method: string }>> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(toImportUrl(definitionPath))) as {
        default?: Record<string, { aliases?: string[] }>;
      };
      let defaultExport;
      try {
        defaultExport = definition.default;
      } catch {
        await new Promise((resolve) => {
          setTimeout(resolve, 10);
        });
        defaultExport = definition.default;
      }

      if (!defaultExport) {
        return [];
      }

      const aliasesWithMethods: Array<{ alias: string; method: string }> = [];

      // Get aliases from each method
      for (const method of Object.keys(defaultExport)) {
        const methodDef = defaultExport[method];
        if (methodDef?.aliases && Array.isArray(methodDef.aliases)) {
          for (const alias of methodDef.aliases) {
            aliasesWithMethods.push({ alias, method });
          }
        }
      }

      return aliasesWithMethods;
    } catch {
      // Definition file doesn't exist or can't be loaded
    }
    return [];
  }

  /**
   * Reconcile each definition's declared `path` with its filesystem location.
   *
   * The declared `path` is the single source of truth for the endpoint's URL
   * and tool name at runtime (URL building, `endpointToToolName`, client-route
   * dispatch). The dev server (TanStack/Vite) serves API routes from the
   * filesystem, so when the two diverge the URL 404s — silently, with a 200 HTML
   * body — and any client read of that endpoint hangs forever.
   *
   * Rather than fail the build, we treat the directory as authoritative and
   * rewrite the definition's `path` array to match it (this also normalizes
   * dynamic segments to the bracketed `[param]` form). Returns a list of
   * human-readable descriptions of the rewrites performed (empty when nothing
   * needed fixing). No writes happen when `dryRun` is set.
   */
  private static async reconcileDefinitionPaths(
    routeFiles: string[],
    dryRun: boolean,
  ): Promise<string[]> {
    const fixes: string[] = [];

    for (const routeFile of routeFiles) {
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
      // Filesystem segments between src/ and the definition file — truth.
      const fsSegments = extractNestedPath(definitionPath);

      let defaultExport: ApiSection | undefined;
      try {
        const definition = (await import(toImportUrl(definitionPath))) as {
          default?: ApiSection;
        };
        try {
          defaultExport = definition.default;
        } catch {
          // Bun plugin race - yield then retry once.
          await new Promise((resolve) => {
            setTimeout(resolve, 10);
          });
          defaultExport = definition.default;
        }
      } catch {
        // Import failure is reported by other passes; skip path reconcile here.
        continue;
      }
      if (!defaultExport) {
        continue;
      }

      // Collect the distinct declared paths that diverge from the filesystem.
      // Every method in a definition shares the same directory, so in practice
      // this is one entry, but we handle each method's literal independently.
      const staleLiterals = new Set<string>();
      for (const endpoint of Object.values(defaultExport)) {
        const declaredPath = (endpoint as { path?: readonly string[] })?.path;
        if (!declaredPath) {
          continue;
        }
        // Exact match (including bracket form) means nothing to do.
        if (
          declaredPath.length === fsSegments.length &&
          declaredPath.every((seg, i) => seg === fsSegments[i])
        ) {
          continue;
        }
        staleLiterals.add(serializePathArray(declaredPath));
      }

      if (staleLiterals.size === 0) {
        continue;
      }

      const rel = stripProjectRoot(definitionPath);
      const correctLiteral = serializePathArray(fsSegments);

      if (dryRun) {
        fixes.push(
          `Would update \`path\` in ${rel} to match filesystem "${fsSegments.join("/")}".`,
        );
        continue;
      }

      let source: string;
      try {
        source = await readFile(definitionPath, "utf8");
      } catch {
        continue;
      }

      let rewritten = source;
      for (const stale of staleLiterals) {
        rewritten = replacePathLiteral(rewritten, stale, correctLiteral);
      }
      if (rewritten !== source) {
        await writeFile(definitionPath, rewritten, "utf8");
        fixes.push(
          `Updated \`path\` in ${rel} to match filesystem "${fsSegments.join("/")}".`,
        );
      }
    }

    return fixes;
  }

  /**
   * Generate route handlers content with dynamic imports and real aliases from definitions
   * Main paths include method suffix (e.g., "core/agent/ai-stream/POST")
   * Aliases also include method from their definition
   */
  private static async generateContent(
    routeFiles: string[],
    logger: EndpointLogger,
    outputFile: string,
    webIgnoredImportPaths?: Set<string>,
  ): Promise<{ content: string; hotPathsContent: string; routeCount: number }> {
    const pathMap: Record<
      string,
      { importPath: string; relPath: string; method: string }
    > = {};
    const allPaths: string[] = [];
    let routeCount = 0;

    // Build path map with method suffixes and aliases (deduplicate)
    for (const routeFile of routeFiles) {
      const { path } = extractPathKey(routeFile);
      const importPath = generateAbsoluteImportPath(routeFile, "route");
      const relPath = toProjectRelativePath(routeFile);

      // Get methods for this route from definition file
      const methods =
        await RouteHandlersGenerator.extractMethodsFromDefinition(routeFile);

      if (methods.length === 0) {
        logger.warn(
          formatWarning(` No methods found: ${stripProjectRoot(routeFile)}`),
        );
        continue;
      }

      // Add main path with method suffix for each method (e.g., "v1_core_agent_ai-stream_POST")
      for (const method of methods) {
        const pathWithMethod = `${path}${PATH_SEPARATOR}${method}`;
        if (!pathMap[pathWithMethod]) {
          pathMap[pathWithMethod] = { importPath, relPath, method };
          allPaths.push(pathWithMethod);
          routeCount++;
        }
      }

      // Extract and add real aliases from definition file (with their method)
      const definitionAliases =
        await RouteHandlersGenerator.extractAliasesFromDefinition(routeFile);
      for (const { alias, method } of definitionAliases) {
        // Only add if not already present (first wins)
        if (!pathMap[alias]) {
          pathMap[alias] = { importPath, relPath, method };
          allPaths.push(alias);
        }
      }
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Routes that use process.cwd() + fs scanning - must be turbopack-ignored to
    // prevent NFT from tracing the entire project through these imports.
    const NFT_IGNORE_PATTERNS = [
      /\/tanstack-start\/generate\//,
      /\/cli\/setup\/install\//,
      /\/generators\//,
      /\/builder\//,
      /\/check\//,
      /\/guard\//,
    ];
    const needsTurbopackIgnore = (p: string): boolean =>
      NFT_IGNORE_PATTERNS.some((re) => re.test(p));

    // Generate static-import cases (bundler-traceable)
    const cases: string[] = [];
    // Also build the hot-paths map: toolName -> { relPath, method }
    const hotPathEntries: string[] = [];
    // One canonical path per unique module — enough to warm every import.
    const prewarmSeen = new Set<string>();
    const prewarmPaths: string[] = [];
    for (const path of allPaths) {
      const { importPath, relPath, method } = pathMap[path];
      if (!prewarmSeen.has(importPath)) {
        prewarmSeen.add(importPath);
        prewarmPaths.push(path);
      }
      // WEB_OFF routes get bundle-ignore hints so Next.js/webpack/turbopack
      // don't trace their import graphs into the prod bundle.
      const isWebIgnored = webIgnoredImportPaths?.has(importPath) ?? false;
      const ignoreComment =
        isWebIgnored || needsTurbopackIgnore(importPath)
          ? "/* webpackIgnore: true */ /* turbopackIgnore: true */ "
          : "";
      // Static import strings for bundler tracing
      const returnWithTools = `      return (await import(${ignoreComment}"${importPath}")).tools`;
      const returnWithParen = `      return (await import(${ignoreComment}"${importPath}"))`;
      const fullLine = `      return (await import(${ignoreComment}"${importPath}")).tools.${method} as GenericHandlerBase;`;

      if (fullLine.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import(${ignoreComment}"${importPath}")).tools.${method} as GenericHandlerBase;`);
      } else if (returnWithTools.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import(${ignoreComment}"${importPath}")).tools
        .${method} as GenericHandlerBase;`);
      } else if (returnWithParen.length <= 80) {
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (await import(${ignoreComment}"${importPath}"))
        .tools.${method} as GenericHandlerBase;`);
      } else if (ignoreComment) {
        // turbopack/webpack ignore comments force the import onto its own line
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import(
          ${ignoreComment}"${importPath}"
        )
      ).tools.${method} as GenericHandlerBase;`);
      } else {
        // prettier/prettier is disabled in this file — emit compact form
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).tools.${method} as GenericHandlerBase;`);
      }

      // eslint-disable-next-line i18next/no-literal-string
      const hotPathNeedsQuotes = /[^a-zA-Z0-9_$]/.test(path);
      const hotPathKey = hotPathNeedsQuotes ? `"${path}"` : path;
      const relPathLine = `    relPath: "${relPath}",`;
      if (relPathLine.length <= 80) {
        hotPathEntries.push(
          `  ${hotPathKey}: {\n    relPath: "${relPath}",\n    method: "${method}",\n  },`,
        );
      } else {
        hotPathEntries.push(
          `  ${hotPathKey}: {\n    relPath:\n      "${relPath}",\n    method: "${method}",\n  },`,
        );
      }
    }

    // eslint-disable-next-line i18next/no-literal-string
    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/route-handlers";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Routes found": routeFiles.length,
      "Total paths (with aliases)": allPaths.length,
    });

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${header}

import type { GenericHandlerBase } from "${getRelativeImportPath(HANDLER_MODULE, outputFile)}";

/* eslint-disable prettier/prettier */

/**
 * Single-flight queue for the lazy route imports below. Route modules pull
 * in huge cyclic graphs (route -> repository -> definition -> widgets);
 * CONCURRENT dynamic imports of two such graphs can deadlock the Vite SSR
 * module runner in dev (both imports pend forever — observed as remote tool
 * dispatches hanging on the receiving instance). Serializing removes the
 * concurrency the deadlock needs; warm cache hits resolve on the next
 * microtask.
 */
let routeImportQueue: Promise<GenericHandlerBase | null | undefined> =
  Promise.resolve(undefined);

/** Resolved handler cache — repeat lookups skip the queue entirely. */
const routeHandlerCache = new Map<string, GenericHandlerBase | null>();

/**
 * Dynamically import route handler by path.
 * @param path - The route path (e.g., "core/agent/chat/threads")
 * @returns The route module or null if not found
 */
export async function getRouteHandler(
  path: string,
): Promise<GenericHandlerBase | null> {
  const cached = routeHandlerCache.get(path);
  if (cached !== undefined) {
    return cached;
  }
  const run = routeImportQueue.then(async () => {
    const again = routeHandlerCache.get(path);
    if (again !== undefined) {
      return again;
    }
    const loaded = await importRouteHandler(path);
    routeHandlerCache.set(path, loaded);
    return loaded;
  });
  // Chain regardless of outcome so one failed import never blocks the queue.
  routeImportQueue = run.catch(() => undefined);
  return run;
}

async function importRouteHandler(
  path: string,
): Promise<GenericHandlerBase | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}

/**
 * DEV prewarm: sequentially warm every route module in the background when
 * this registry first loads. Cold Vite SSR loads of large cyclic route
 * graphs are slow and, when triggered concurrently by a remote tool
 * dispatch, can deadlock the module runner — observed as remote tool calls
 * hanging forever on the receiving dev instance. With the queue above, the
 * first real lookup lines up behind the warm-up instead. One canonical path
 * per unique module. No-op in production and in the browser.
 */
const ROUTE_PREWARM_PATHS: string[] = [
${prewarmPaths.map((pp) => `  ${JSON.stringify(pp)},`).join("\n")}
];
if (
  typeof window === "undefined" &&
  process.env.NODE_ENV === "development"
) {
  void (async (): Promise<void> => {
    for (const p of ROUTE_PREWARM_PATHS) {
      await getRouteHandler(p).catch(() => undefined);
    }
  })();
}
`;

    // eslint-disable-next-line i18next/no-literal-string
    const hotPathsContent = `${header}

/* eslint-disable prettier/prettier */

/**
 * Maps every tool name to its src-relative path and HTTP method.
 * Used by the MCP hot-loader to build fresh (cache-busted) imports at runtime
 * without static import strings that bundlers would trace.
 *
 * Paths are relative because this file is committed: an absolute path is only
 * ever correct on the machine that ran the generator. The hot-loader resolves
 * them against the same src root at runtime.
 */
export const routeHotPaths: Record<
  string,
  { relPath: string; method: string }
> = {
${hotPathEntries.join("\n")}
};
`;
    return { content, hotPathsContent, routeCount };
  }
}
