/* eslint-disable i18next/no-literal-string */
/* eslint-disable no-console */
import { parseError } from "next-vibe/shared/utils/parse-error";

import type { CountryLanguage } from "@/i18n/core/config";
import { simpleT } from "@/i18n/core/shared";
import type { TranslationKey } from "@/i18n/core/static-types";

import type { EndpointLogger } from "./types";

// Type for logger arguments to satisfy ESLint
interface LoggerArg {
  [key: string]: string | number | boolean | null;
}
type LoggerArgs = Array<string | number | boolean | null | LoggerArg>;

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
    return `[${getElapsedTime()}] [vibe][${level}] ${t(message)}`;
  };

  return {
    info(message: TranslationKey, ...args: LoggerArgs): void {
      console.log(formatMessage("INFO", message), ...args);
    },

    error(
      message: TranslationKey,
      error?: LoggerArg,
      ...args: LoggerArgs
    ): void {
      const typedError = error ? parseError(error) : undefined;
      console.error(formatMessage("ERROR", message), typedError, ...args);
    },

    vibe(message: TranslationKey, ...args: LoggerArgs): void {
      // Special vibe formatting
      const translatedMessage = t(message);
      console.log(`[${getElapsedTime()}] ${translatedMessage}`, ...args);
    },

    debug(message: TranslationKey, ...args: LoggerArgs): void {
      if (debugEnabled) {
        console.log(formatMessage("DEBUG", message), ...args);
      }
    },
    warn(message: TranslationKey, ...args: LoggerArgs): void {
      console.warn(formatMessage("WARN", message), ...args);
    },
    isDebugEnabled: debugEnabled,
  };
}
