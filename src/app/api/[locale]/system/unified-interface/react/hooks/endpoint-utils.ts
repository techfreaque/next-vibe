import { Environment } from "next-vibe/shared/utils";
import { useMemo } from "react";

import type { DeepPartial } from "@/app/api/[locale]/shared/types/utils";
import {
  ALL_METHODS,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import { clearFormsAfterSuccessInDev } from "@/config/debug";
import { envClient } from "@/config/env-client";

import type { CreateApiEndpointAny } from "../../shared/types/endpoint";
import type {
  AutoPrefillConfig,
  FormDataPriority,
  FormDataSources,
} from "./endpoint-types";

/**
 * Utility to detect available HTTP methods from endpoints object
 */
export function useAvailableMethods<
  T extends Partial<Record<Methods, CreateApiEndpointAny>>,
>(endpoints: T): Methods[] {
  return useMemo(() => {
    return Object.keys(endpoints).filter((method) =>
      ALL_METHODS.includes(method as Methods),
    ) as Methods[];
  }, [endpoints]);
}

/**
 * Utility to determine primary mutation method (prefer POST, then PUT, then PATCH, then DELETE)
 */
export function usePrimaryMutationMethod(
  availableMethods: Methods[],
): Methods | null {
  return useMemo(() => {
    if (availableMethods.includes(Methods.POST)) {
      return Methods.POST;
    }
    if (availableMethods.includes(Methods.PUT)) {
      return Methods.PUT;
    }
    if (availableMethods.includes(Methods.PATCH)) {
      return Methods.PATCH;
    }
    if (availableMethods.includes(Methods.DELETE)) {
      return Methods.DELETE;
    }
    return null;
  }, [availableMethods]);
}

/**
 * Utility to determine if forms should be cleared after success
 * In production: always clear
 * In development: controlled by debug setting
 */
export function shouldClearFormAfterSuccess(): boolean {
  if (envClient.NODE_ENV === Environment.PRODUCTION) {
    return true;
  }

  // In development, use debug setting
  return clearFormsAfterSuccessInDev;
}

/**
 * Check if value is a plain object (not array, null, date, etc.)
 * @param value - The value to check
 * @returns True if value is a plain object
 */
function isPlainObject(
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Type guard requires unknown for runtime type checking
  value: unknown,
): value is Record<string, DeepPartial<never>> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp)
  );
}

/**
 * Deep merge objects, with later sources taking priority
 * Handles nested objects recursively
 */
export function deepMerge<T>(...sources: (T | null | undefined)[]): T {
  // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- Deep merge requires dynamic object building
  const result: Record<string, DeepPartial<never>> = {};

  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const key of Object.keys(source)) {
      const sourceValue = source[key as keyof typeof source];
      const resultValue = result[key];

      if (isPlainObject(sourceValue) && isPlainObject(resultValue)) {
        // Recursively merge nested objects
        result[key] = deepMerge(
          resultValue as DeepPartial<T>,
          sourceValue as DeepPartial<T>,
        ) as DeepPartial<never>;
      } else if (sourceValue !== undefined) {
        // Primitive or array - later source wins
        result[key] = sourceValue as DeepPartial<never>;
      }
    }
  }

  return result as T;
}

/**
 * Utility to safely merge form data with prefilled data
 * Performs deep merge for nested objects
 * Priority (lowest to highest): defaultValues < prefillData < initialState < savedData
 */
export function mergeFormData<T>(
  defaultValues: T | undefined,
  prefillData: T | undefined,
  initialState: T | undefined,
  savedData?: T | null,
): T {
  return deepMerge<T>(defaultValues, prefillData, initialState, savedData);
}

/**
 * Determines the priority and merges form data from multiple sources
 * Priority order (highest to lowest):
 * 1. initialState (explicit override)
 * 2. serverData (from API)
 * 3. defaultValues (fallback)
 * Note: localStorageData is ignored (local storage functionality removed)
 */
export function determineFormDataPriority<T>(
  sources: FormDataSources<T>,
  config: AutoPrefillConfig,
): FormDataPriority<T> {
  const { autoPrefill = true } = config;
  // autoPrefillFromLocalStorage is ignored - local storage functionality removed

  // Start with default values as base
  let finalData = { ...(sources.defaultValues || {}) } as Partial<T>;
  let dataSource: FormDataPriority<T>["dataSource"] = "default";
  const hasUnsavedChanges = false; // Always false - no local storage

  // Apply server data if autoPrefill is enabled
  if (autoPrefill && sources.serverData) {
    finalData = { ...finalData, ...sources.serverData };
    dataSource = "server";
  }

  // Initial state always wins (explicit override)
  if (sources.initialState) {
    finalData = { ...finalData, ...sources.initialState };
    dataSource = "initialState";
  }

  return {
    finalData,
    dataSource,
    hasUnsavedChanges,
  };
}
