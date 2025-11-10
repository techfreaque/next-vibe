import { Environment } from "next-vibe/shared/utils";
import type { ReactNode } from "react";

import { envClient } from "@/config/env-client";

import { languageConfig } from "..";
import type { Countries, CountryLanguage, Languages } from "./config";
import { defaultLocaleConfig, translations } from "./config";
import type {
  TParams,
  TranslationElement,
  TranslationKey,
} from "./static-types";

// ================================================================================
// TRANSLATION UTILITIES
// ================================================================================

/**
 * Centralized translation error handling
 * This ensures we only log each error once and in a consistent format
 */
export function logTranslationError(
  errorType: "missing" | "invalid_type" | "fallback_missing",
  key: string,
  context?: string,
): void {
  if (!languageConfig.debug || envClient.NODE_ENV === Environment.PRODUCTION) {
    return;
  }

  const prefix = context ? `[${context}] ` : "";

  // Using process.stderr for error logging in development
  // In production, these would be caught by error monitoring
  switch (errorType) {
    case "missing":
      if (typeof process !== "undefined" && process.stderr) {
        process.stderr.write(`${prefix}Translation key not found: ${key}\n`);
      }
      break;
    case "invalid_type":
      if (typeof process !== "undefined" && process.stderr) {
        process.stderr.write(
          `${prefix}Translation key "${key}" has invalid type (expected string)\n`,
        );
      }
      break;
    case "fallback_missing":
      if (typeof process !== "undefined" && process.stderr) {
        process.stderr.write(
          `${prefix}Translation key not found in fallback language: ${key}\n`,
        );
      }
      break;
  }
}

/**
 * Navigate through a translation object using an array of keys
 */
function navigateTranslationPath(
  startValue: TranslationElement,
  keys: string[],
  fullKey: string,
  language: Languages,
  fallbackLanguage: Languages,
  isUsingFallback: boolean,
  context?: string,
): TranslationElement | string | undefined {
  // Import shared navigation logic
  const { navigateTranslationObject } = require("./shared-translation-utils");
  const value = navigateTranslationObject(startValue, keys);

  // Handle error logging for missing keys
  if (value === undefined) {
    if (isUsingFallback || language === fallbackLanguage) {
      logTranslationError(
        isUsingFallback ? "fallback_missing" : "missing",
        fullKey,
        context,
      );
    }
  }

  return value as TranslationElement | string | undefined;
}

/**
 * Try to get translation from a specific language
 */
function tryGetTranslation<K extends TranslationKey>(
  key: K,
  language: Languages,
  isUsingFallback: boolean,
  fallbackLanguage: Languages,
  context?: string,
): TranslationElement | string | undefined {
  const keys = key?.split(".");
  const translationsForLanguage = translations[language];

  if (!translationsForLanguage) {
    return undefined;
  }

  return navigateTranslationPath(
    translationsForLanguage,
    keys,
    key,
    language,
    fallbackLanguage,
    isUsingFallback,
    context,
  );
}

/**
 * Get translation value from nested object using dot notation
 */
export function getTranslationValue<K extends TranslationKey>(
  key: K,
  language: Languages,
  fallbackLanguage: Languages = defaultLocaleConfig.language,
  context?: string,
): TranslationElement | string | undefined {
  // Try with the specified language first
  const value = tryGetTranslation(
    key,
    language,
    false,
    fallbackLanguage,
    context,
  );

  // If translation not found and not already using fallback, try fallback language
  if (value === undefined && language !== fallbackLanguage) {
    return tryGetTranslation(
      key,
      fallbackLanguage,
      true,
      fallbackLanguage,
      context,
    );
  }

  return value;
}

/**
 * Process translation value and handle parameters
 */
export function processTranslationValue<K extends TranslationKey>(
  value: TranslationElement | string | undefined,
  key: K,
  params?: TParams,
  context?: string,
): string {
  // Import shared processing logic
  const { processTranslationValue: sharedProcess } = require("./shared-translation-utils");
  const result = sharedProcess(value, key, params, context);

  // Log error if value was not a string (only for global translations)
  if (value !== undefined && value !== null && typeof value !== "string") {
    logTranslationError("invalid_type", key, context);
  }

  return result;
}

/**
 * Main translation function that combines getting and processing the value
 */
export function translateKey<K extends TranslationKey>(
  key: K,
  language: Languages,
  params?: TParams,
  fallbackLanguage?: Languages,
  context?: string,
): string {
  // Use hardcoded fallback to avoid circular dependency during initialization
  const actualFallbackLanguage = fallbackLanguage ?? "en";
  const value = getTranslationValue(
    key,
    language,
    actualFallbackLanguage,
    context,
  );
  return processTranslationValue(value, key, params, context);
}

/**
 * Shared component rendering logic for translation components
 * This can be used by both client and server components
 */
export function renderTranslation<K extends TranslationKey>(
  translatedValue: string | undefined,
  key: K,
): ReactNode {
  // If the translation is empty or not a string, show the key as fallback
  if (!translatedValue) {
    // We don't log here because the error would have already been logged
    // in getTranslationValue or processTranslationValue
    return key;
  }

  return translatedValue;
}

export function getCountryFromLocale(locale: CountryLanguage): Countries {
  return locale.split("-")[1] as Countries;
}

export function getLanguageFromLocale(locale: CountryLanguage): Languages {
  return locale.split("-")[0] as Languages;
}
