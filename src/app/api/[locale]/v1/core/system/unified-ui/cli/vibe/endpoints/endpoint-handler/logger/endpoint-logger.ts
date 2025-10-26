/* eslint-disable no-console */
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { EndpointLogger, LoggerMetadata } from "./types";

/**
 * Creates a logger instance for endpoint handlers
 * Provides pretty formatted logging with running time in seconds
 */
export function createEndpointLogger(
  debugEnabled = false,
  startTime: number = Date.now(),
  locale: CountryLanguage,
): EndpointLogger {
  const { t } = simpleT(locale);

  const getElapsedTime = (): string => {
    const elapsed = (Date.now() - startTime) / 1000;
    return `${elapsed.toFixed(3)}s`;
  };

  const formatMessage = (level: string, message: TranslationKey): string => {
    return `[${getElapsedTime()}] ${t(message)}`;
  };

  return {
    info(message: TranslationKey, ...metadata: LoggerMetadata[]): void {
      console.log(formatMessage("INFO", message), ...metadata);
    },

    error(
      message: TranslationKey,
      error?: LoggerMetadata,
      ...metadata: LoggerMetadata[]
    ): void {
      const typedError = error ? parseError(error) : undefined;
      console.error(formatMessage("ERROR", message), typedError, ...metadata);
    },

    vibe(message: TranslationKey, ...metadata: LoggerMetadata[]): void {
      // Special vibe formatting
      const translatedMessage = t(message);
      console.log(`[${getElapsedTime()}] ${translatedMessage}`, ...metadata);
    },

    debug(message: TranslationKey, ...metadata: LoggerMetadata[]): void {
      if (debugEnabled) {
        console.log(formatMessage("DEBUG", message), ...metadata);
      }
    },
    warn(message: TranslationKey, ...metadata: LoggerMetadata[]): void {
      console.warn(formatMessage("WARN", message), ...metadata);
    },
    isDebugEnabled: debugEnabled,
  };
}
