import { Environment } from "next-vibe/shared/utils";
import { useMemo } from "react";
import type { FieldValues } from "react-hook-form";

import type { CreateApiEndpoint } from "@/app/api/[locale]/system/unified-interface/shared/endpoints/definition/create";
import {
  ALL_METHODS,
  Methods,
} from "@/app/api/[locale]/system/unified-interface/shared/types/enums";
import type { UserRoleValue } from "@/app/api/[locale]/user/user-roles/enum";
import { clearFormsAfterSuccessInDev } from "@/config/debug";
import { envClient } from "@/config/env-client";

import type {
  AutoPrefillConfig,
  FormDataPriority,
  FormDataSources,
} from "./endpoint-types";
import type {
  ApiFormOptions,
  ApiMutationOptions,
  ApiQueryFormOptions,
  ApiQueryOptions,
} from "./types";

/**
 * Utility to detect available HTTP methods from endpoints object
 */
export function useAvailableMethods<
  T extends Partial<
    Record<
      Methods,
      CreateApiEndpoint<
        string,
        Methods,
        readonly UserRoleValue[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        any
      >
    >
  >,
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
 * Utility to safely merge form data with prefilled data
 * localStorage data takes precedence over all other data
 */
export function mergeFormData<T>(
  defaultValues: Partial<T> | undefined,
  prefillData: Partial<T> | undefined,
  initialState: Partial<T> | undefined,
  savedData?: Partial<T> | null,
): Partial<T> {
  return {
    ...(defaultValues || {}),
    ...(prefillData || {}),
    ...(initialState || {}),
    ...(savedData || {}), // localStorage wins
  };
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

/**
 * Shallow merge utility that merges two option objects.
 * Hook options take priority over endpoint options.
 */
function mergeOptions<T extends FieldValues>(
  endpointOptions: T | undefined,
  hookOptions: T | undefined,
): T | undefined {
  if (!endpointOptions && !hookOptions) {
    return undefined;
  }
  if (!endpointOptions) {
    return hookOptions;
  }
  if (!hookOptions) {
    return endpointOptions;
  }
  // Hook options override endpoint options
  return { ...endpointOptions, ...hookOptions };
}

/**
 * Merge endpoint read options with hook-provided read options
 * Hook options take priority over endpoint options
 */
export function mergeReadOptions<
  TRequest extends FieldValues,
  TResponse,
  TUrlVariables,
>(
  endpointOptions:
    | {
        formOptions?: ApiQueryFormOptions<TRequest>;
        queryOptions?: ApiQueryOptions<TRequest, TResponse, TUrlVariables>;
        urlPathParams?: TUrlVariables;
        initialState?: Partial<TRequest>;
      }
    | undefined,
  hookOptions:
    | {
        formOptions?: ApiQueryFormOptions<TRequest>;
        queryOptions?: ApiQueryOptions<TRequest, TResponse, TUrlVariables>;
        urlPathParams?: TUrlVariables;
        initialState?: Partial<TRequest>;
      }
    | undefined,
): {
  formOptions?: ApiQueryFormOptions<TRequest>;
  queryOptions?: ApiQueryOptions<TRequest, TResponse, TUrlVariables>;
  urlPathParams?: TUrlVariables;
  initialState?: Partial<TRequest>;
} {
  return {
    formOptions: mergeOptions(
      endpointOptions?.formOptions,
      hookOptions?.formOptions,
    ),
    queryOptions: mergeOptions(
      endpointOptions?.queryOptions,
      hookOptions?.queryOptions,
    ),
    urlPathParams: hookOptions?.urlPathParams ?? endpointOptions?.urlPathParams,
    initialState: mergeOptions(
      endpointOptions?.initialState,
      hookOptions?.initialState,
    ),
  };
}

/**
 * Merge endpoint create options with hook-provided create options
 * Hook options take priority over endpoint options
 */
export function mergeCreateOptions<
  TRequest extends FieldValues,
  TResponse,
  TUrlVariables,
>(
  endpointOptions:
    | {
        formOptions?: ApiFormOptions<TRequest>;
        mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
        urlPathParams?: TUrlVariables;
        autoPrefillData?: Partial<TRequest>;
        initialState?: Partial<TRequest>;
      }
    | undefined,
  hookOptions:
    | {
        formOptions?: ApiFormOptions<TRequest>;
        mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
        urlPathParams?: TUrlVariables;
        autoPrefillData?: Partial<TRequest>;
        initialState?: Partial<TRequest>;
      }
    | undefined,
): {
  formOptions?: ApiFormOptions<TRequest>;
  mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
  urlPathParams?: TUrlVariables;
  autoPrefillData?: Partial<TRequest>;
  initialState?: Partial<TRequest>;
} {
  return {
    formOptions: mergeOptions(
      endpointOptions?.formOptions,
      hookOptions?.formOptions,
    ),
    mutationOptions: mergeOptions(
      endpointOptions?.mutationOptions,
      hookOptions?.mutationOptions,
    ),
    urlPathParams: hookOptions?.urlPathParams ?? endpointOptions?.urlPathParams,
    autoPrefillData: mergeOptions(
      endpointOptions?.autoPrefillData,
      hookOptions?.autoPrefillData,
    ),
    initialState: mergeOptions(
      endpointOptions?.initialState,
      hookOptions?.initialState,
    ),
  };
}

/**
 * Merge endpoint delete options with hook-provided delete options
 * Hook options take priority over endpoint options
 */
export function mergeDeleteOptions<TRequest, TResponse, TUrlVariables>(
  endpointOptions:
    | {
        mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
        urlPathParams?: TUrlVariables;
      }
    | undefined,
  hookOptions:
    | {
        mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
        urlPathParams?: TUrlVariables;
      }
    | undefined,
): {
  mutationOptions?: ApiMutationOptions<TRequest, TResponse, TUrlVariables>;
  urlPathParams?: TUrlVariables;
} {
  return {
    mutationOptions: mergeOptions(
      endpointOptions?.mutationOptions,
      hookOptions?.mutationOptions,
    ),
    urlPathParams: hookOptions?.urlPathParams ?? endpointOptions?.urlPathParams,
  };
}
