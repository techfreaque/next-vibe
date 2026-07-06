/**
 * Route Handlers Generator Repository
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import "server-only";

import { readFile, writeFile } from "node:fs/promises";

import { PATH_SEPARATOR } from "next-vibe/core/core-utils/path";
import type { ApiSection } from "next-vibe/core/definition/endpoint-base";
import type { GenericHandlerBase } from "next-vibe/core/route/handler";
import type { WidgetData } from "next-vibe/core/utils/json";
import { parseError } from "next-vibe/core/utils/parse-error";
import { formatCount, formatWarning } from "next-vibe/logger/formatters";
import type { EndpointLogger } from "next-vibe/logger/types";
import type {
  GeneratorContext,
  GeneratorResult,
} from "next-vibe/tooling/generators/shared/shared-inputs";
import {
  extractNestedPath,
  extractPathKey,
  generateAbsoluteImportPath,
  generateFileHeader,
  stripProjectRoot,
  writeGeneratedFile,
} from "next-vibe/tooling/generators/shared/utils";

const OUTPUT_FILE = "src/generated/routes/handlers.ts";

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
  return RouteHandlersGenerator.run(ctx, OUTPUT_FILE);
}

class RouteHandlersGenerator {
  static async run(
    ctx: GeneratorContext,
    outputFile: string,
  ): Promise<GeneratorResult> {
    const { logger } = ctx;
    const routeFiles = ctx.files.route;
    const definitionFiles = ctx.files.definition;

    {
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

      // Generate content with only valid route files
      const { content, hotPathsContent, routeCount } =
        await RouteHandlersGenerator.generateContent(validRouteFiles, logger);

      // Write route-handlers.ts and hot-paths.ts
      const hotPathsFile = outputFile.replace(
        /\/handlers.ts$/,
        "/hot-paths.ts",
      );
      await writeGeneratedFile(outputFile, content, false);
      await writeGeneratedFile(hotPathsFile, hotPathsContent, false);

      // Enforce that every subscribable WS channel has a resource-level
      // canSubscribe guard on the emitting method. Fail-closed at build time:
      // an unguarded channel would authorize on role alone (a leak), so we
      // abort rather than generate it.
      const wsErrors =
        await RouteHandlersGenerator.validateWsChannels(validRouteFiles);
      if (wsErrors.length > 0) {
        for (const err of wsErrors) {
          logger.error(formatWarning(err));
        }
        return {
          summary: "route handlers (failed: WS channel guards)",
          failed: `Route handlers generation failed (WS channel guards): ${wsErrors.join("; ")}`,
        };
      }

      // Generate ws-channels.ts alongside route-handlers — one entry per
      // endpoint method that declares at least one client-delivered event.
      const wsChannelsFile = outputFile.replace(
        /\/handlers.ts$/,
        "/ws-channels.ts",
      );
      const { content: wsContent, channelCount } =
        await RouteHandlersGenerator.generateWsChannelsContent(validRouteFiles);
      await writeGeneratedFile(wsChannelsFile, wsContent, false);
      logger.debug(
        `Generated ws-channels.ts with ${channelCount} channel entries`,
      );

      return {
        summary: `route handlers (${routeCount} routes, ${channelCount} channels)`,
        counts: { routes: routeCount, channels: channelCount },
      };
    }
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
      const definition = (await import(definitionPath)) as {
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
      const definition = (await import(definitionPath)) as {
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
      // Filesystem segments between [locale] and the definition file — truth.
      const fsSegments = extractNestedPath(definitionPath);

      let defaultExport: ApiSection | undefined;
      try {
        const definition = (await import(definitionPath)) as {
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
  ): Promise<{ content: string; hotPathsContent: string; routeCount: number }> {
    const pathMap: Record<
      string,
      { importPath: string; absPath: string; method: string }
    > = {};
    const allPaths: string[] = [];
    let routeCount = 0;

    // Build path map with method suffixes and aliases (deduplicate)
    for (const routeFile of routeFiles) {
      const { path } = extractPathKey(routeFile);
      const importPath = generateAbsoluteImportPath(routeFile, "route");

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
          pathMap[pathWithMethod] = { importPath, absPath: routeFile, method };
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
          pathMap[alias] = { importPath, absPath: routeFile, method };
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
    // Also build the hot-paths map: toolName -> { absPath, method }
    const hotPathEntries: string[] = [];
    for (const path of allPaths) {
      const { importPath, absPath, method } = pathMap[path];
      // Add turbopack/webpack ignore hints for routes that scan the filesystem
      const ignoreComment = needsTurbopackIgnore(importPath)
        ? "/* turbopackIgnore: true */ /* webpackIgnore: true */ "
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
      } else {
        const awaitLine = `        await import(${ignoreComment}"${importPath}")`;
        if (awaitLine.length <= 80) {
          // eslint-disable-next-line i18next/no-literal-string
          cases.push(`    case "${path}":
      return (
        await import(${ignoreComment}"${importPath}")
      ).tools.${method} as GenericHandlerBase;`);
        } else {
          // Import path too long even inside parens: break the import args
          // eslint-disable-next-line i18next/no-literal-string
          cases.push(`    case "${path}":
      return (
        await import(
          ${ignoreComment}"${importPath}"
        )
      ).tools.${method} as GenericHandlerBase;`);
        }
      }

      // eslint-disable-next-line i18next/no-literal-string
      hotPathEntries.push(
        `  "${path}": { absPath: "${absPath}", method: "${method}" },`,
      );
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

import type { GenericHandlerBase } from "next-vibe/core/route/handler";

/* eslint-disable prettier/prettier */

/**
 * Dynamically import route handler by path.
 * @param path - The route path (e.g., "core/agent/chat/threads")
 * @returns The route module or null if not found
 */
export async function getRouteHandler(
  path: string,
): Promise<GenericHandlerBase | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;

    // eslint-disable-next-line i18next/no-literal-string
    const hotPathsContent = `${header}

/* eslint-disable prettier/prettier */

/**
 * Maps every tool name to its import path and HTTP method.
 * Used by the MCP hot-loader to build fresh (cache-busted) imports at runtime
 * without static import strings that bundlers would trace.
 */
export const routeHotPaths: Record<string, { absPath: string; method: string }> = {
${hotPathEntries.join("\n")}
};
`;
    return { content, hotPathsContent, routeCount };
  }

  /**
   * Extract methods that declare at least one CLIENT-DELIVERED event from a
   * definition file.
   *
   * An endpoint method qualifies for WS channel authorization when its `events`
   * map contains at least one event that is delivered to clients — i.e. an event
   * whose `clientDelivery` flag is NOT `false`. Server-only-event endpoints
   * (every event flagged `clientDelivery: false`, e.g. execute-tool's tool
   * dispatch wires, remote-event-bridge, sync) are authorized as system
   * channels and intentionally excluded here.
   */
  private static async extractWsMethodsFromDefinition(
    routeFile: string,
  ): Promise<Array<{ method: string; scope: string | undefined }>> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: Record<
          string,
          {
            events?: Record<string, { clientDelivery?: false }>;
            channel?: { scope?: string };
          }
        >;
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

      const HTTP_METHODS = [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD",
        "OPTIONS",
      ];
      const methods: Array<{ method: string; scope: string | undefined }> = [];
      for (const method of Object.keys(defaultExport)) {
        if (!HTTP_METHODS.includes(method)) {
          continue;
        }
        const events = defaultExport[method]?.events;
        if (!events || typeof events !== "object") {
          continue;
        }
        // Qualify only when at least one event is delivered to clients.
        const hasClientEvent = Object.values(events).some(
          (event) => event?.clientDelivery !== false,
        );
        if (hasClientEvent) {
          methods.push({
            method,
            scope: defaultExport[method]?.channel?.scope,
          });
        }
      }
      return methods;
    } catch {
      return [];
    }
  }

  /**
   * Validate that every client-subscribable WS channel has a `resolveChannel`
   * on the EXACT method that emits its events.
   *
   * This is the build-time BACKSTOP to the type-level enforcement (a method with
   * client-delivered events whose definition has channel scope resource/resolved
   * cannot compile without resolveChannel). It additionally guards the stale-
   * generated-file case and the scope:"user" case (which the type forbids a
   * resolver for — and which is correct: a user-scoped channel needs no resolver,
   * so it's skipped here too).
   *
   * It also catches the wrong-method footgun: a `resolveChannel` on GET while the
   * events live on PATCH/DELETE leaves those channels unguarded. We check the
   * resolver on the channel's own method, matching the runtime (lazyResolveChannel
   * keys by method too).
   *
   * Route modules are imported here (CLI/generator context, not the prod bundle
   * init path) only for the small set of channel-bearing routes — bounded work,
   * and the only reliable way to read the runtime `tools[method].resolveChannel`.
   */
  private static async validateWsChannels(
    routeFiles: string[],
  ): Promise<string[]> {
    const errors: string[] = [];

    for (const routeFile of routeFiles) {
      const methods =
        await RouteHandlersGenerator.extractWsMethodsFromDefinition(routeFile);
      if (methods.length === 0) {
        continue;
      }

      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");

      let tools: Record<
        string,
        { resolveChannel?: GenericHandlerBase["resolveChannel"] } | undefined
      >;
      try {
        const routeModule = (await import(routeFile)) as {
          tools?: Record<
            string,
            | { resolveChannel?: GenericHandlerBase["resolveChannel"] }
            | undefined
          >;
        };
        tools = routeModule.tools ?? {};
      } catch (error) {
        errors.push(
          `WS channel validation could not import ${stripProjectRoot(routeFile)}: ` +
            `${parseError(error).message}. A route that declares client-delivered ` +
            `events must be importable so its resolveChannel can be verified.`,
        );
        continue;
      }

      const rel = stripProjectRoot(routeFile);
      for (const { method, scope } of methods) {
        if (scope === undefined) {
          errors.push(
            `Missing channel declaration in ${stripProjectRoot(definitionPath)} (${method}): ` +
              `this method emits a client-delivered event but its definition has no ` +
              `\`channel\`. Add \`channel: { scope: "user" | "resource" | "resolved" }\`.`,
          );
          continue;
        }
        // user scope is fully definition-decided — no route resolver required.
        if (scope === "user") {
          continue;
        }
        const handler = tools[method];
        if (typeof handler?.resolveChannel !== "function") {
          errors.push(
            `Missing resolveChannel in ${rel} (${method}): the definition declares ` +
              `channel scope "${scope}", so this method must supply a resolveChannel ` +
              `that authorizes subscribers and decides the channel. Add it to the ` +
              `${method} handler — on ${method} (the method that emits the events), ` +
              `not another method of the same endpoint.`,
          );
        }
      }
    }

    return errors;
  }

  /**
   * Generate ws-channels.ts content.
   *
   * For every endpoint method that declares a client-delivered event, emits an
   * entry that:
   *   - eagerly imports the definition module (lightweight, side-effect-free)
   *     to read the endpoint object (path + allowedRoles), and
   *   - lazily wires resolveChannel from the route module (deferred until first
   *     call) to avoid pulling repositories/DB into WS channel registration.
   *
   * Mirrors the lazyResolveChannel pattern from ws-channel-registry.ts.
   */
  private static async generateWsChannelsContent(
    routeFiles: string[],
  ): Promise<{ content: string; channelCount: number }> {
    interface WsChannelTarget {
      defImport: string;
      routeImport: string;
      method: string;
      defAlias: string;
      scope: string | undefined;
    }

    const targets: WsChannelTarget[] = [];

    for (const routeFile of routeFiles) {
      const methods =
        await RouteHandlersGenerator.extractWsMethodsFromDefinition(routeFile);
      if (methods.length === 0) {
        continue;
      }

      const defImport = generateAbsoluteImportPath(routeFile, "definition");
      const routeImport = generateAbsoluteImportPath(routeFile, "route");
      // Build a stable, unique alias from the path segments + method.
      const segments = extractNestedPath(routeFile);
      const aliasBase = segments
        .map((s: string) =>
          s.replaceAll(/\[|\]/g, "").replaceAll(/[^A-Za-z0-9]/g, "_"),
        )
        .join("_");

      for (const { method, scope } of methods) {
        targets.push({
          defImport,
          routeImport,
          method,
          defAlias: `${aliasBase}_${method}Def`,
          scope,
        });
      }
    }

    // Stable order for deterministic output.
    targets.sort((a, b) => a.defAlias.localeCompare(b.defAlias));

    const channelCount = targets.length;

    const autoGenTitle = "AUTO-GENERATED FILE - DO NOT EDIT";
    const generatorName = "generators/route-handlers";
    const header = generateFileHeader(autoGenTitle, generatorName, {
      "Channels found": channelCount,
    });

    // Eager definition imports — collected into the Promise.all destructure.
    const eagerImports = targets
      .map((target) => `    import("${target.defImport}"),`)
      .join("\n");
    const eagerDestructure = targets
      .map((target) => `    ${target.defAlias},`)
      .join("\n");

    // Entries: endpoint from the eager def + its resolveChannel. A `user`-scope
    // channel rides the caller's own user/{id} channel — the framework's static
    // `userChannelResolver` answers `{ kind: "user" }` with no route code (the
    // route has no resolver, by design). resource/resolved scopes wire the route's
    // resolveChannel lazily (deferred import to keep DB out of registration).
    const entries = targets
      .map((target) =>
        target.scope === "user"
          ? `    {
      endpoint: ${target.defAlias}.default.${target.method},
      resolveChannel: userChannelResolver,
    },`
          : `    {
      endpoint: ${target.defAlias}.default.${target.method},
      resolveChannel: lazyResolveChannel(
        () => import("${target.routeImport}"),
        "${target.method}",
      ),
    },`,
      )
      .join("\n");

    // eslint-disable-next-line i18next/no-literal-string
    const content = `${header}

/* eslint-disable prettier/prettier */

import {
  lazyResolveChannel,
  userChannelResolver,
  type WsChannelEntry,
} from "next-vibe/realtime/ws-channel-registry";

/**
 * Returns every endpoint that exposes a client-subscribable WebSocket channel.
 *
 * Definition modules are imported eagerly (lightweight, side-effect-free) to
 * read the endpoint object (path + allowedRoles). Route modules are imported
 * lazily via lazyResolveChannel — only when a channel match needs resource-level
 * authorization — to avoid circular init errors in the production bundle.
 */
export async function getGeneratedWsEndpoints(): Promise<WsChannelEntry[]> {
  const [
${eagerDestructure}
  ] = await Promise.all([
${eagerImports}
  ]);

  return [
${entries}
  ];
}
`;

    return { content, channelCount };
  }
}
