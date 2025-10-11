import { Environment, errorLogger } from "next-vibe/shared/utils";
import type { ReactNode } from "react";

import { translationsKeyMode } from "@/config/debug";
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

  switch (errorType) {
    case "missing":
      errorLogger(`${prefix}Translation key not found: ${key}`);
      break;
    case "invalid_type":
      errorLogger(
        `${prefix}Translation key "${key}" has invalid type (expected string)`,
      );
      break;
    case "fallback_missing":
      errorLogger(
        `${prefix}Translation key not found in fallback language: ${key}`,
      );
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
  let value: TranslationElement | undefined = startValue;

  for (const k of keys) {
    if (value === undefined) {
      break;
    }

    // Handle array access
    if (Array.isArray(value)) {
      const index = Number(k);
      if (!Number.isNaN(index) && index >= 0 && index < value.length) {
        value = value[index] as TranslationElement;
      } else {
        // Only log if using fallback or if we're not about to try fallback
        if (isUsingFallback || language === fallbackLanguage) {
          logTranslationError(
            isUsingFallback ? "fallback_missing" : "missing",
            `${fullKey} (invalid array index: ${k})`,
            context,
          );
        }
        value = undefined;
        break;
      }
    }
    // Handle object access
    else if (typeof value === "object" && k in value) {
      value = value[k] as TranslationElement;
    } else {
      // Only log if using fallback or if we're not about to try fallback
      if (isUsingFallback || language === fallbackLanguage) {
        logTranslationError(
          isUsingFallback ? "fallback_missing" : "missing",
          fullKey,
          context,
        );
      }
      value = undefined;
      break;
    }
  }

  return value;
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
  const keys = key.split(".");
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
  // If value is undefined, return the key as fallback
  if (value === undefined) {
    return `${key}${params ? ` (${JSON.stringify(params)})` : ""}`;
  }

  // If value is a string, process parameters
  if (typeof value === "string") {
    let translationValue: string = value;
    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translationValue = translationValue.replace(
          new RegExp(`{{${paramKey}}}`, "g"),
          String(paramValue),
        );
      });
    }
    if (translationsKeyMode) {
      // we wanna return urls remote and local as is
      if (
        translationValue.startsWith("http://") ||
        translationValue.startsWith("/") ||
        translationValue.startsWith("https://")
      ) {
        return translationValue;
      }

      return params ? `${key} (${Object.keys(params).join(", ")})` : `${key}`;
    }
    return translationValue;
  }

  // Handle non-string values
  logTranslationError("invalid_type", key, context);

  // Return the key as fallback
  return key;
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
  const value = getTranslationValue(key, language, actualFallbackLanguage, context);
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
