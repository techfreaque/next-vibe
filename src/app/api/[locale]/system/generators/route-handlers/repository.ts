/**
 * Route Handlers Generator Repository
 * Generates route-handlers.ts with dynamic imports and flat path structure
 */

import "server-only";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import {
  formatCount,
  formatDuration,
  formatGenerator,
  formatWarning,
} from "@/app/api/[locale]/system/logger/formatters";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import type { GenericHandlerBase } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/route/handler";
import type { ApiSection } from "@/app/api/[locale]/system/unified-interface/shared/types/endpoint-base";
import { PATH_SEPARATOR } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";
import type { TranslatedKeyType } from "@/i18n/core/scoped-translation";

import type { LiveIndex } from "../shared/live-index";
import {
  extractNestedPath,
  extractPathKey,
  findFilesRecursively,
  generateAbsoluteImportPath,
  generateFileHeader,
  stripProjectRoot,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsRouteHandlersT } from "./i18n";

// Type definitions
interface RouteHandlersRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface RouteHandlersResponseType {
  success: boolean;
  message: TranslatedKeyType;
  routesFound: number;
  duration: number;
  outputFile?: string;
}

/**
 * Strip brackets so a dynamic segment compares equal to its declared form:
 * filesystem "[id]" and declared path "[id]" both reduce to "id".
 */
function sanitizePathSegmentForCompare(seg: string): string {
  return seg.replaceAll(/\[|\]/g, "");
}

/**
 * Route Handlers Generator Repository Implementation
 */
export class RouteHandlersGeneratorRepository {
  static async generateRouteHandlers(
    data: RouteHandlersRequestType,
    logger: EndpointLogger,
    t: GeneratorsRouteHandlersT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<RouteHandlersResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting route handlers generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let routeFiles: string[];
      let definitionFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        routeFiles = [...liveIndex.routeFiles];
        definitionFiles = [...liveIndex.definitionFiles];
      } else {
        // Use template string to prevent Turbopack from statically tracing paths
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug("Discovering route files");
        routeFiles = findFilesRecursively(startDir, "route.ts");
        definitionFiles = findFilesRecursively(startDir, "definition.ts");
      }

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

      // Validate declared paths match the filesystem before generating. A
      // mismatch produces a route that 404s on the dev server (silent 200 HTML),
      // which hangs any client read of that endpoint — fail loudly instead.
      const pathErrors =
        await RouteHandlersGeneratorRepository.validateDefinitionPaths(
          validRouteFiles,
        );
      if (pathErrors.length > 0) {
        for (const err of pathErrors) {
          logger.error(formatWarning(err));
        }
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            duration: Date.now() - startTime,
          },
        });
      }

      // Generate content with only valid route files
      const { content, hotPathsContent, routeCount } =
        await RouteHandlersGeneratorRepository.generateContent(
          validRouteFiles,
          logger,
        );

      // Write route-handlers.ts and hot-paths.ts
      const hotPathsFile = outputFile.replace(
        /\/route-handlers\.ts$/,
        "/route-hot-paths.ts",
      );
      await writeGeneratedFile(outputFile, content, data.dryRun);
      await writeGeneratedFile(hotPathsFile, hotPathsContent, data.dryRun);

      // Enforce that every subscribable WS channel has a resource-level
      // canSubscribe guard on the emitting method. Fail-closed at build time:
      // an unguarded channel would authorize on role alone (a leak), so we
      // abort rather than generate it.
      const wsErrors =
        await RouteHandlersGeneratorRepository.validateWsChannels(
          validRouteFiles,
        );
      if (wsErrors.length > 0) {
        for (const err of wsErrors) {
          logger.error(formatWarning(err));
        }
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: {
            duration: Date.now() - startTime,
          },
        });
      }

      // Generate ws-channels.ts alongside route-handlers — one entry per
      // endpoint method that declares at least one client-delivered event.
      const wsChannelsFile = outputFile.replace(
        /\/route-handlers\.ts$/,
        "/ws-channels.ts",
      );
      const { content: wsContent, channelCount } =
        await RouteHandlersGeneratorRepository.generateWsChannelsContent(
          validRouteFiles,
        );
      await writeGeneratedFile(wsChannelsFile, wsContent, data.dryRun);
      logger.debug(
        `Generated ws-channels.ts with ${channelCount} channel entries`,
      );

      const duration = Date.now() - startTime;

      logger.info(
        formatGenerator(
          `Generated route handlers file with ${formatCount(routeCount, "route")} in ${formatDuration(duration)}`,
          "🔗",
        ),
      );

      return success({
        success: true,
        message: t("post.success.generated"),
        routesFound: routeFiles.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error("Route handlers generation failed", {
        error: parseError(error),
        duration,
      });

      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: {
          duration,
        },
      });
    }
  }

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
   * Validate that each definition's declared `path` matches its filesystem
   * location, and that dynamic segments use the correct `[param]` format.
   *
   * The declared `path` is the single source of truth for the endpoint's URL
   * and tool name at runtime (URL building, `endpointToToolName`, client-route
   * dispatch). The dev server (TanStack/Vite) serves API routes from the
   * filesystem, so when the two diverge the URL 404s — silently, with a 200 HTML
   * body — and any client read of that endpoint hangs forever. We catch this at
   * generation time instead.
   *
   * Returns a list of human-readable error strings (empty when all valid).
   */
  private static async validateDefinitionPaths(
    routeFiles: string[],
  ): Promise<string[]> {
    const errors: string[] = [];

    for (const routeFile of routeFiles) {
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
      // Filesystem segments between [locale] and the definition file.
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
        // Import failure is reported by other passes; skip path validation here.
        continue;
      }
      if (!defaultExport) {
        continue;
      }

      for (const [method, endpoint] of Object.entries(defaultExport)) {
        const declaredPath = (endpoint as { path?: readonly string[] })?.path;
        if (!declaredPath) {
          continue;
        }

        const rel = stripProjectRoot(definitionPath);

        // 1) Length + structural match against the filesystem location.
        const fsKey = fsSegments.map(sanitizePathSegmentForCompare).join("/");
        const declKey = declaredPath
          .map(sanitizePathSegmentForCompare)
          .join("/");
        if (fsKey !== declKey) {
          errors.push(
            `Path mismatch in ${rel} (${method}): declared path "${declaredPath.join("/")}" ` +
              `does not match filesystem location "${fsSegments.join("/")}". ` +
              `Update the definition's \`path\` to match the directory (or move the folder).`,
          );
          continue;
        }

        // 2) Dynamic-segment format: a bracketed directory segment must be
        //    declared with the SAME bracketed token (not ":param" or bare name).
        declaredPath.forEach((declSeg, i) => {
          const fsSeg = fsSegments[i];
          const fsIsDynamic = fsSeg?.startsWith("[") && fsSeg.endsWith("]");
          const declIsDynamic =
            declSeg.startsWith("[") && declSeg.endsWith("]");
          if (fsIsDynamic && declSeg !== fsSeg) {
            errors.push(
              `Dynamic segment format error in ${rel} (${method}): segment "${declSeg}" ` +
                `must be written as "${fsSeg}" to match the directory. ` +
                `Use the bracketed form (e.g. "[id]"), not ":id" or a bare name.`,
            );
          } else if (declIsDynamic && !fsIsDynamic) {
            errors.push(
              `Dynamic segment format error in ${rel} (${method}): declared segment "${declSeg}" ` +
                `is dynamic but the directory segment "${fsSeg}" is static.`,
            );
          }
        });
      }
    }

    return errors;
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
        await RouteHandlersGeneratorRepository.extractMethodsFromDefinition(
          routeFile,
        );

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
        await RouteHandlersGeneratorRepository.extractAliasesFromDefinition(
          routeFile,
        );
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
        // eslint-disable-next-line i18next/no-literal-string
        cases.push(`    case "${path}":
      return (
        await import(${ignoreComment}"${importPath}")
      ).tools.${method} as GenericHandlerBase;`);
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

import type { GenericHandlerBase } from "../unified-interface/shared/endpoints/route/handler";

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
  ): Promise<string[]> {
    const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
    try {
      const definition = (await import(definitionPath)) as {
        default?: Record<
          string,
          {
            events?: Record<string, { clientDelivery?: false }>;
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
      const methods: string[] = [];
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
          methods.push(method);
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
        await RouteHandlersGeneratorRepository.extractWsMethodsFromDefinition(
          routeFile,
        );
      if (methods.length === 0) {
        continue;
      }

      // A scope:"user" channel needs no route resolver (the definition decided
      // it). Read the definition's channel.scope to know which methods require a
      // resolver vs which are user-scoped (delivered on user/{id}).
      const definitionPath = routeFile.replace("/route.ts", "/definition.ts");
      let defaultExport:
        | Record<string, { channel?: { scope?: string } } | undefined>
        | undefined;
      try {
        const definition = (await import(definitionPath)) as {
          default?: Record<
            string,
            { channel?: { scope?: string } } | undefined
          >;
        };
        defaultExport = definition.default;
      } catch {
        defaultExport = undefined;
      }

      let tools: Record<string, { resolveChannel?: unknown } | undefined>;
      try {
        const routeModule = (await import(routeFile)) as {
          tools?: Record<string, { resolveChannel?: unknown } | undefined>;
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
      for (const method of methods) {
        const scope = defaultExport?.[method]?.channel?.scope;
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
   *   - lazily wires canSubscribe from the route module (deferred until first
   *     call) to avoid pulling repositories/DB into WS channel registration.
   *
   * Mirrors the lazyCanSubscribe pattern from ws-channel-registry.ts.
   */
  private static async generateWsChannelsContent(
    routeFiles: string[],
  ): Promise<{ content: string; channelCount: number }> {
    interface WsChannelTarget {
      defImport: string;
      routeImport: string;
      method: string;
      defAlias: string;
    }

    const targets: WsChannelTarget[] = [];

    for (const routeFile of routeFiles) {
      const methods =
        await RouteHandlersGeneratorRepository.extractWsMethodsFromDefinition(
          routeFile,
        );
      if (methods.length === 0) {
        continue;
      }

      const defImport = generateAbsoluteImportPath(routeFile, "definition");
      const routeImport = generateAbsoluteImportPath(routeFile, "route");
      // Build a stable, unique alias from the path segments + method.
      const segments = extractNestedPath(routeFile);
      const aliasBase = segments
        .map((s) => s.replaceAll(/\[|\]/g, "").replaceAll(/[^A-Za-z0-9]/g, "_"))
        .join("_");

      for (const method of methods) {
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

    // Entries: endpoint from the eager def, resolveChannel lazily from the route.
    const entries = targets
      .map(
        (target) => `    {
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
} from "../unified-interface/websocket/ws-channel-registry";

/**
 * Returns every endpoint that exposes a client-subscribable WebSocket channel.
 *
 * Definition modules are imported eagerly (lightweight, side-effect-free) to
 * read the endpoint object (path + allowedRoles). Route modules are imported
 * lazily via lazyCanSubscribe — only when a channel match needs resource-level
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
