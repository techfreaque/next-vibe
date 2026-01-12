/**
 * Config Loader Service
 * Load and validate release configuration
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { ResponseType } from "next-vibe/shared/types/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/shared/types/response.schema";
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { EndpointLogger } from "../../unified-interface/shared/logger/endpoint";
import type { ReleaseConfig } from "../definition";
import { DEFAULT_CONFIG_PATH, MESSAGES } from "./constants";
import { isReleaseConfigModule } from "./utils";

// ============================================================================
// Interface
// ============================================================================

export interface IConfigLoader {
  /**
   * Load release configuration from file
   */
  load(
    logger: EndpointLogger,
    configPath?: string,
  ): Promise<ResponseType<ReleaseConfig>>;

  /**
   * Get the default config path
   */
  getDefaultPath(): string;

  /**
   * Check if config file exists
   */
  exists(configPath?: string): boolean;
}

// ============================================================================
// Implementation
// ============================================================================

export class ConfigLoader implements IConfigLoader {
  /**
   * Load release configuration from file
   */
  async load(
    logger: EndpointLogger,
    configPath: string = DEFAULT_CONFIG_PATH,
  ): Promise<ResponseType<ReleaseConfig>> {
    const resolvedConfigPath = resolve(process.cwd(), configPath);

    if (!existsSync(resolvedConfigPath)) {
      logger.error(MESSAGES.CONFIG_NOT_FOUND, { path: resolvedConfigPath });
      return fail({
        message: "app.api.system.releaseTool.config.fileNotFound",
        errorType: ErrorResponseTypes.NOT_FOUND,
        messageParams: { path: resolvedConfigPath },
      });
    }

    try {
      // Use dynamic path to avoid static analysis - this is intentionally a runtime config load
      const configUrl = `file://${resolvedConfigPath}`;
      const importedModule = await import(/* webpackIgnore: true */ configUrl);

      if (!isReleaseConfigModule(importedModule)) {
        logger.error(MESSAGES.CONFIG_INVALID, { path: resolvedConfigPath });
        return fail({
          message: "app.api.system.releaseTool.config.invalidFormat",
          errorType: ErrorResponseTypes.INVALID_FORMAT_ERROR,
        });
      }

      logger.debug(MESSAGES.CONFIG_LOADED, { path: resolvedConfigPath });
      return success(importedModule.default);
    } catch (error) {
      logger.error(MESSAGES.CONFIG_INVALID, {
        ...parseError(error),
        path: resolvedConfigPath,
      });
      return fail({
        message: "app.api.system.releaseTool.config.errorLoading",
        errorType: ErrorResponseTypes.INTERNAL_ERROR,
        messageParams: { error: String(error) },
      });
    }
  }

  /**
   * Get the default config path
   */
  getDefaultPath(): string {
    return DEFAULT_CONFIG_PATH;
  }

  /**
   * Check if config file exists
   */
  exists(configPath: string = DEFAULT_CONFIG_PATH): boolean {
    const resolvedConfigPath = resolve(process.cwd(), configPath);
    return existsSync(resolvedConfigPath);
  }
}

export const configLoader = new ConfigLoader();
