/**
 * Config Loader Service
 * Load and validate release configuration
 */

import { existsSync } from "node:fs";

import type { CountryLanguage } from "next-vibe/core/i18n/core/config";
import type { ResponseType } from "next-vibe/core/route/response.schema";
import {
  ErrorResponseTypes,
  fail,
  success,
} from "next-vibe/core/route/response.schema";
import { parseError } from "next-vibe/core/utils/parse-error";
import type { EndpointLogger } from "next-vibe/logger/types";
import { scopedTranslation } from "next-vibe/tooling/release/i18n";
import {
  DEFAULT_CONFIG_PATH,
  MESSAGES,
} from "next-vibe/tooling/release/repository/constants";

import type { ReleaseConfig } from "../definition";
import { isReleaseConfigModule } from "./utils";

export class ConfigLoader {
  /**
   * Load release configuration from file
   */
  async load(
    logger: EndpointLogger,
    locale: CountryLanguage,
    configPath: string = DEFAULT_CONFIG_PATH,
  ): Promise<ResponseType<ReleaseConfig>> {
    // Use template string to prevent Turbopack from statically tracing paths
    const resolvedConfigPath = `${process.cwd()}/${configPath}`;
    const { t } = scopedTranslation.scopedT(locale);

    if (!existsSync(resolvedConfigPath)) {
      logger.error(MESSAGES.CONFIG_NOT_FOUND, { path: resolvedConfigPath });
      return fail({
        message: t("config.fileNotFound"),
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
          message: t("config.invalidFormat"),
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
        message: t("config.errorLoading"),
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
    // Use template string to prevent Turbopack from statically tracing paths
    const resolvedConfigPath = `${process.cwd()}/${configPath}`;
    return existsSync(resolvedConfigPath);
  }
}

export const configLoader = new ConfigLoader();
