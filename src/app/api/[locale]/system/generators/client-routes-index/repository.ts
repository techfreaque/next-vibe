/**
 * Client Routes Index Generator Repository
 * Generates index file for all route-client.ts files
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
} from "@/app/api/[locale]/system/logger/formatters";
import type { EndpointLogger } from "@/app/api/[locale]/system/logger/types";
import {
  PATH_SEPARATOR,
  pathSegmentsToToolName,
} from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import type { LiveIndex } from "../shared/live-index";
import {
  extractNestedPath,
  extractPathKey,
  findFilesRecursively,
  writeGeneratedFile,
} from "../shared/utils";
import type { GeneratorsClientRoutesIndexT } from "./i18n";

// Type definitions
interface ClientRoutesRequestType {
  outputFile: string;
  dryRun: boolean;
}

interface ClientRoutesResponseType {
  success: boolean;
  message: string;
  routesFound: number;
  duration: number;
  outputFile?: string;
}

/**
 * Client Routes Index Generator Repository
 */
export class ClientRoutesIndexGeneratorRepository {
  static async generateClientRoutesIndex(
    data: ClientRoutesRequestType,
    logger: EndpointLogger,
    t: GeneratorsClientRoutesIndexT,
    liveIndex?: LiveIndex,
  ): Promise<BaseResponseType<ClientRoutesResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting client routes index generation: ${outputFile}`);

      // Use live index when available (dev watcher), otherwise scan from disk
      let clientRouteFiles: string[];

      if (liveIndex) {
        logger.debug("Using live index for file discovery");
        clientRouteFiles = [...liveIndex.clientRouteFiles];
      } else {
        const startDir = `${process.cwd()}/src/app/api/[locale]`;

        logger.debug("Discovering route-client files");
        clientRouteFiles = findFilesRecursively(startDir, "route-client.ts");
      }

      logger.debug(formatCount(clientRouteFiles.length, "route-client file"));

      if (clientRouteFiles.length === 0) {
        return success({
          success: true,
          message: t("post.errors.notFound.title"),
          routesFound: 0,
          duration: Date.now() - startTime,
        });
      }

      // Generate switch cases following route-handlers pattern
      const generated =
        await ClientRoutesIndexGeneratorRepository.generateContent(
          clientRouteFiles,
          logger,
        );

      if (generated.errors) {
        // Fail loudly rather than write a broken index that silently drops
        // client routes (which breaks client-route dispatch for those endpoints).
        for (const err of generated.errors) {
          logger.error(err);
        }
        return fail({
          message: t("post.errors.server.title"),
          errorType: ErrorResponseTypes.INTERNAL_ERROR,
          messageParams: { error: generated.errors.join("; ") },
        });
      }

      const { content, routeCount } = generated;

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;
      const message = formatGenerator(
        `Generated client routes index with ${formatCount(routeCount, "route")} in ${formatDuration(duration)}`,
        "⚙️ ",
      );

      logger.info(message);

      return success({
        success: true,
        message,
        routesFound: routeCount,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      logger.error("Failed to generate client routes index", {
        error: errorMessage,
      });

      return fail({
        message: t("post.errors.server.title"),
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(errorMessage) },
      });
    }
  }

  /**
   * Dynamically import a module, retrying past Bun's TDZ window.
   *
   * Bun can fail an import with "Cannot access 'X' before initialization" when
   * many modules that share underlying modules are imported in quick succession
   * before those shared modules finish initializing. That window closes once the
   * shared module is cached, so we retry on a later macrotask. Returns the module
   * on success, or an error string describing the persistent failure — callers
   * surface it rather than silently producing a broken index.
   */
  private static async importWithRetry(
    file: string,
  ): Promise<{ mod: Record<string, unknown> } | { error: string }> {
    const MAX_ATTEMPTS = 5;
    let lastMessage = "unknown error";
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      try {
        const mod = (await import(file)) as Record<string, unknown>;
        return { mod };
      } catch (error) {
        lastMessage = parseError(error).message;
        // Yield to let the racing module finish initializing, then retry.
        await new Promise<void>((resolve) => {
          setTimeout(resolve, 0);
        });
      }
    }
    return {
      error: `Could not import ${file} after ${MAX_ATTEMPTS} attempts: ${lastMessage}`,
    };
  }

  /**
   * Extract HTTP methods from route-client file by reading the file exports.
   * Returns the methods, or an error string if the file could not be read.
   */
  private static async extractMethodsFromClientRoute(
    routeFile: string,
  ): Promise<{ methods: string[] } | { error: string }> {
    const HTTP_METHODS = [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "HEAD",
      "OPTIONS",
    ];
    const result =
      await ClientRoutesIndexGeneratorRepository.importWithRetry(routeFile);
    if ("error" in result) {
      return result;
    }
    return {
      methods: Object.keys(result.mod).filter((key) =>
        HTTP_METHODS.includes(key),
      ),
    };
  }

  /**
   * Build the runtime lookup key for each method of a client route.
   *
   * The runtime (`callApi`) looks handlers up via `endpointToToolName(endpoint)`,
   * which is derived from the endpoint definition's declared `path` — NOT the
   * filesystem location. For endpoints whose `path` differs from their directory
   * (e.g. favorites lives in `agent/skills/favorites/` but declares
   * `path: ["agent","chat","favorites"]`), keying the switch by the filesystem
   * path produces an unreachable handler, silently falling back to the server API.
   * We read the sibling definition so the generated key matches the runtime exactly.
   *
   * Returns method → toolName-without-method-suffix (the `path` portion of the
   * key). `keys` is empty when the definition exposes no path (caller falls back
   * to the filesystem key); an error string is returned if it can't be read at
   * all — surfaced rather than silently falling back (which would reintroduce the
   * unreachable-handler bug).
   */
  private static async extractPathKeysFromDefinition(
    routeFile: string,
  ): Promise<{ keys: Record<string, string> } | { error: string }> {
    const definitionFile = routeFile.replace(
      /route-client\.ts$/,
      "definition.ts",
    );
    const result =
      await ClientRoutesIndexGeneratorRepository.importWithRetry(
        definitionFile,
      );
    if ("error" in result) {
      return result;
    }
    const definitions = result.mod.default as
      | Record<string, { path?: readonly string[]; method?: string }>
      | undefined;
    const keys: Record<string, string> = {};
    if (definitions) {
      for (const endpoint of Object.values(definitions)) {
        if (!endpoint?.path || !endpoint.method) {
          continue;
        }
        // toolName includes the method suffix; strip it to get the path portion.
        const toolName = pathSegmentsToToolName(endpoint.path, endpoint.method);
        const pathOnly = toolName.slice(
          0,
          -(endpoint.method.length + PATH_SEPARATOR.length),
        );
        keys[endpoint.method] = pathOnly;
      }
    }
    return { keys };
  }

  /**
   * Generate client route handlers content with dynamic imports following route-handlers pattern
   */
  private static async generateContent(
    clientRouteFiles: string[],
    logger: EndpointLogger,
  ): Promise<
    | { content: string; routeCount: number; errors?: undefined }
    | { errors: string[] }
  > {
    const pathMap: Record<string, { importPath: string; method: string }> = {};
    const allPaths: string[] = [];
    const errors: string[] = [];

    // Build path map with method suffixes
    for (const routeFile of clientRouteFiles) {
      const { path: filesystemPath } = extractPathKey(routeFile);
      const nestedPath = extractNestedPath(routeFile);
      const pathStr = nestedPath.join("/");
      const importPath = `@/app/api/[locale]/${pathStr}/route-client`;

      // Get methods for this client route
      const methodsResult =
        await ClientRoutesIndexGeneratorRepository.extractMethodsFromClientRoute(
          routeFile,
        );
      if ("error" in methodsResult) {
        errors.push(methodsResult.error);
        continue;
      }
      const { methods } = methodsResult;

      if (methods.length === 0) {
        // A route-client that imports cleanly but exports no HTTP method is a real
        // bug — recording it produces a visible failure instead of a broken index.
        errors.push(
          `Client route exports no HTTP methods (GET/POST/...): ${routeFile}`,
        );
        continue;
      }

      // Key by the definition's declared `path` (what the runtime looks up),
      // falling back to the filesystem path when the definition has no path.
      const keysResult =
        await ClientRoutesIndexGeneratorRepository.extractPathKeysFromDefinition(
          routeFile,
        );
      if ("error" in keysResult) {
        errors.push(keysResult.error);
        continue;
      }
      const definitionKeys = keysResult.keys;

      // Add path with method suffix for each method (e.g., "agent_skills_favorites_GET")
      for (const method of methods) {
        const path = definitionKeys[method] ?? filesystemPath;
        if (!definitionKeys[method]) {
          logger.warn(
            `Client route method ${method} not found in definition; using filesystem key: ${routeFile}`,
          );
        }
        const pathWithMethod = `${path}${PATH_SEPARATOR}${method}`;
        if (!pathMap[pathWithMethod]) {
          pathMap[pathWithMethod] = { importPath, method };
          allPaths.push(pathWithMethod);
        }
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    // Sort paths for consistent output
    allPaths.sort();

    // Generate getClientRouteHandler function cases
    const cases: string[] = [];
    for (const path of allPaths) {
      const { importPath, method } = pathMap[path];

      const fullLine = `      return (await import("${importPath}")).${method};`;

      if (fullLine.length <= 80) {
        cases.push(`    case "${path}":
      return (await import("${importPath}")).${method};`);
      } else {
        cases.push(`    case "${path}":
      return (
        await import("${importPath}")
      ).${method};`);
      }
    }

    const routeCount = allPaths.length;

    // Generate file content following route-handlers pattern
    const content = `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated by generators/client-routes-index
 *
 * Routes: ${routeCount}
 */

/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dynamically import client route handler by path
 * @param path - The route path (e.g., "agent_skills_favorites_GET")
 * @returns The client route module or null if not found
 */
export async function getClientRouteHandler(path: string): Promise<any | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;
    return { content, routeCount };
  }
}
