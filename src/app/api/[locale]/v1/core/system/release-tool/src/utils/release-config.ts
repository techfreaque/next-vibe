/// <reference types="node" />
/* eslint-disable no-restricted-syntax */
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  createErrorResponse,
  success,
  ErrorResponseTypes,
} from "next-vibe/shared/types/response.schema";

import { parseError } from "next-vibe/shared/utils/parse-error";
import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-interface/shared/logger/endpoint";

import type { ReleaseConfig } from "../types/index.js";

export const DEFAULT_CONFIG_PATH = "release.config.ts";

/**
 * Type guard to validate if an imported module has the expected ReleaseConfig structure
 */
function isReleaseConfigModule(
  // eslint-disable-next-line no-restricted-syntax, oxlint-plugin-restricted/restricted-syntax -- Build Infrastructure: Release config parsing requires 'unknown' for flexible configuration
  module: unknown,
): module is { default: ReleaseConfig } {
  if (typeof module !== "object" || module === null) {
    return false;
  }
  if (!("default" in module)) {
    return false;
  }
  const defaultExport = module.default as ReleaseConfig | null;
  if (typeof defaultExport !== "object" || defaultExport === null) {
    return false;
  }
  if (!("packages" in defaultExport)) {
    return false;
  }
  return Array.isArray(defaultExport.packages);
}

/**
 * Loads and returns the release configuration.
 */
export async function loadConfig(
  logger: EndpointLogger,
  configPath: string,
): Promise<ResponseType<ReleaseConfig>> {
  const resolvedConfigPath = resolve(process.cwd(), configPath);

  if (!existsSync(resolvedConfigPath)) {
    logger.error("Config file not found", { path: resolvedConfigPath });
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.config.fileNotFound",
      ErrorResponseTypes.NOT_FOUND,
      { path: resolvedConfigPath },
    );
  }

  try {
    const importedModule = await import(`file://${resolvedConfigPath}`);

    if (!isReleaseConfigModule(importedModule)) {
      logger.error("Invalid config format", { path: resolvedConfigPath });
      return createErrorResponse(
        "app.api.v1.core.system.releaseTool.config.invalidFormat",
        ErrorResponseTypes.INVALID_FORMAT_ERROR,
      );
    }

    logger.info("Successfully loaded config", { path: resolvedConfigPath });
    return success(importedModule.default);
  } catch (error) {
    logger.error("Error loading config", {
      ...parseError(error),
      path: resolvedConfigPath,
    });
    return createErrorResponse(
      "app.api.v1.core.system.releaseTool.config.errorLoading",
      ErrorResponseTypes.INTERNAL_ERROR,
      { error: String(error) },
    );
  }
}
