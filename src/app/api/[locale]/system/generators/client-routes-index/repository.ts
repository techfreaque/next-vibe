/**
 * Client Routes Index Generator Repository
 * Generates index file for all route-client.ts files
 */

import "server-only";

import { join } from "node:path";

import type { ResponseType as BaseResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "@/app/api/[locale]/system/unified-interface/shared/logger/endpoint";
import {
  formatCount,
  formatGenerator,
} from "@/app/api/[locale]/system/unified-interface/shared/logger/formatters";
import { PATH_SEPARATOR } from "@/app/api/[locale]/system/unified-interface/shared/utils/path";

import {
  extractNestedPath,
  extractPathKey,
  findFilesRecursively,
  writeGeneratedFile,
} from "../shared/utils";

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
class ClientRoutesIndexGeneratorRepositoryImpl {
  async generateClientRoutesIndex(
    data: ClientRoutesRequestType,
    logger: EndpointLogger,
  ): Promise<BaseResponseType<ClientRoutesResponseType>> {
    const startTime = Date.now();

    try {
      const outputFile = data.outputFile;
      logger.debug(`Starting client routes index generation: ${outputFile}`);

      // Discover route-client files
      const apiCorePath = ["src", "app", "api", "[locale]"];
      const startDir = join(process.cwd(), ...apiCorePath);

      logger.debug("Discovering route-client files");
      const clientRouteFiles = findFilesRecursively(
        startDir,
        "route-client.ts",
      );

      logger.debug(formatCount(clientRouteFiles.length, "route-client file"));

      if (clientRouteFiles.length === 0) {
        return success({
          success: true,
          message: "No client routes found",
          routesFound: 0,
          duration: Date.now() - startTime,
        });
      }

      // Generate switch cases following route-handlers pattern
      const content = await this.generateContent(clientRouteFiles, logger);

      // Write file
      await writeGeneratedFile(outputFile, content, data.dryRun);

      const duration = Date.now() - startTime;
      const message = formatGenerator(
        `Generated client routes index in ${duration}ms`,
        "⚙️ ",
      );

      logger.info(message);

      return success({
        success: true,
        message,
        routesFound: clientRouteFiles.length,
        duration,
        outputFile: data.dryRun ? undefined : outputFile,
      });
    } catch (error) {
      const errorMessage = parseError(error);
      logger.error("Failed to generate client routes index", {
        error: errorMessage,
      });

      return fail({
        message: `Failed to generate client routes index: ${errorMessage}`,
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
      });
    }
  }

  /**
   * Extract HTTP methods from route-client file by reading the file exports
   */
  private async extractMethodsFromClientRoute(
    routeFile: string,
  ): Promise<string[]> {
    try {
      const clientRoute = await import(routeFile);

      // Get all HTTP method exports
      const methods = Object.keys(clientRoute).filter((key) =>
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
   * Generate client route handlers content with dynamic imports following route-handlers pattern
   */
  private async generateContent(
    clientRouteFiles: string[],
    logger: EndpointLogger,
  ): Promise<string> {
    const pathMap: Record<string, { importPath: string; method: string }> = {};
    const allPaths: string[] = [];

    // Build path map with method suffixes
    for (const routeFile of clientRouteFiles) {
      const { path } = extractPathKey(routeFile);
      const nestedPath = extractNestedPath(routeFile);
      const pathStr = nestedPath.join("/");
      const importPath = `@/app/api/[locale]/${pathStr}/route-client`;

      // Get methods for this client route
      const methods = await this.extractMethodsFromClientRoute(routeFile);

      if (methods.length === 0) {
        logger.warn(`No methods found in client route: ${routeFile}`);
        continue;
      }

      // Add path with method suffix for each method (e.g., "agent_chat_favorites_GET")
      for (const method of methods) {
        const pathWithMethod = `${path}${PATH_SEPARATOR}${method}`;
        if (!pathMap[pathWithMethod]) {
          pathMap[pathWithMethod] = { importPath, method };
          allPaths.push(pathWithMethod);
        }
      }
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

    const totalPaths = allPaths.length;
    const routesCount = clientRouteFiles.length;

    // Generate file content following route-handlers pattern
    return `/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated by generators/client-routes-index
 *
 * Client routes found: ${routesCount}
 * Total paths (with aliases): ${totalPaths}
 */

/* eslint-disable prettier/prettier */
/* eslint-disable i18next/no-literal-string */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Dynamically import client route handler by path
 * @param path - The route path (e.g., "agent_chat_favorites_GET")
 * @returns The client route module or null if not found
 */
export async function getClientRouteHandler(
  path: string,
): Promise<any | null> {
  switch (path) {
${cases.join("\n")}
    default:
      return null;
  }
}
`;
  }
}

export const ClientRoutesIndexGeneratorRepository =
  new ClientRoutesIndexGeneratorRepositoryImpl();
