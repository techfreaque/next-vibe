// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import type { CreateApiEndpointAny } from "../../core/definition/endpoint-base";
import type { CountryLanguage } from "../../core/i18n/core/config";
import type { DeepPartial } from "../../core/utils/type-utils";
import type { JwtPayloadType } from "../../identity/auth/types";
import type { EndpointLogger } from "../../logger/types";
import { useEffect, useMemo, useRef } from "react";

import { deepMerge } from "./endpoint-utils";
import type { CacheKeyRequestData } from "./query-key-builder";
import type {
  ApiFormOptions,
  ApiFormReturn,
  ApiMutationOptions,
} from "./types";
import { useApiForm } from "./use-api-mutation-form";

/**
 * Creates a form integrated with API mutation based on the endpoint's request schema
 * Works with both React and React Native
 *
 * Features:
 * - Form validation using Zod schema
 * - Form persistence using localStorage (enabled by default)
 * - API integration with error handling
 * - Auto-prefilling from GET endpoint data (localStorage wins)
 * - Form clearing based on environment and debug settings
 * - Toast notifications for success and error states
 *
 * @param primaryEndpoint - The API endpoint to use for mutations
 * @param options - Form options including defaultValues and persistence options
 * @returns Form and mutation for API interaction with enhanced error handling
 */
export function useEndpointCreate<TEndpoint extends CreateApiEndpointAny>(
  primaryEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  user: JwtPayloadType,
  locale: CountryLanguage,
  options: {
    formOptions?: ApiFormOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["FormValues"]
    >;
    mutationOptions?: ApiMutationOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["ResponseOutput"],
      TEndpoint["types"]["UrlVariablesOutput"]
    >;
    autoPrefillData?: DeepPartial<TEndpoint["types"]["FormValues"]>;
    initialState?: DeepPartial<TEndpoint["types"]["FormValues"]>;
    urlPathParams?: TEndpoint["types"]["UrlVariablesOutput"];
  },
): ApiFormReturn<
  TEndpoint["types"]["RequestOutput"],
  TEndpoint["types"]["ResponseOutput"],
  TEndpoint["types"]["UrlVariablesOutput"],
  TEndpoint["types"]["FormValues"]
> | null {
  // Return null if endpoint is not provided
  if (!primaryEndpoint) {
    return null;
  }

  // Stable serialized keys for object dependencies to prevent infinite re-renders
  // when callers pass new object literals on every render
  const urlPathParamsKey = JSON.stringify(options.urlPathParams ?? null);
  const autoPrefillDataKey = JSON.stringify(options.autoPrefillData ?? null);
  const initialStateKey = JSON.stringify(options.initialState ?? null);

  // Merge endpoint and hook options (hook takes priority)
  // Merge defaultValues separately to combine autoPrefillData and initialState
  /* eslint-disable react-compiler/react-compiler */
  const mergedFormOptions = useMemo(() => {
    const merged = deepMerge(
      (primaryEndpoint.options?.formOptions ?? {}) as ApiFormOptions<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["FormValues"]
      >,
      (options.formOptions ?? {}) as ApiFormOptions<
        TEndpoint["types"]["RequestOutput"],
        TEndpoint["types"]["FormValues"]
      >,
    );

    // Merge defaultValues priority: endpoint < hook < urlPathParams < autoPrefill < initialState
    // urlPathParams are included so requestUrlPathParamsField fields are pre-filled in the form
    const mergedDefaultValues = deepMerge(
      primaryEndpoint.options?.formOptions?.defaultValues,
      options.formOptions?.defaultValues,
      options.urlPathParams,
      options.autoPrefillData,
      options.initialState,
    );

    return {
      ...merged,
      defaultValues: mergedDefaultValues,
    } as ApiFormOptions<
      TEndpoint["types"]["RequestOutput"],
      TEndpoint["types"]["FormValues"]
    >;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- serialized keys used for stable object comparison
  }, [
    primaryEndpoint.options,
    options.formOptions,
    urlPathParamsKey,
    autoPrefillDataKey,
    initialStateKey,
  ]);
  /* eslint-enable react-compiler/react-compiler */

  const mergedMutationOptions = useMemo(() => {
    const endpointMutOpts = primaryEndpoint.options?.mutationOptions as
      | ApiMutationOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >
      | undefined;
    const hookMutOpts = options.mutationOptions as
      | ApiMutationOptions<
          TEndpoint["types"]["RequestOutput"],
          TEndpoint["types"]["ResponseOutput"],
          TEndpoint["types"]["UrlVariablesOutput"]
        >
      | undefined;
    return deepMerge(endpointMutOpts, hookMutOpts);
  }, [primaryEndpoint.options, options.mutationOptions]);

  // Use the existing mutation form hook with merged options
  const formResult = useApiForm(
    primaryEndpoint,
    logger,
    user,
    locale,
    mergedFormOptions,
    mergedMutationOptions,
    {
      urlPathParams: options.urlPathParams,
      requestData: options.initialState as CacheKeyRequestData<TEndpoint>,
    },
  );

  // Track the previous serialized prefill key to avoid resetting when object references
  // change but values are identical (prevents infinite reset loops)
  const prevPrefillKeyRef = useRef<string | null>(null);
  const prefillKey = `${urlPathParamsKey}|${autoPrefillDataKey}|${initialStateKey}`;

  // Reset form when prefill data actually changes (after initial render)
  // Uses serialized comparison so new object literals don't cause spurious resets
  // urlPathParams are included so requestUrlPathParamsField fields display their values
  /* eslint-disable react-compiler/react-compiler */
  useEffect(() => {
    if (formResult?.form && prefillKey !== prevPrefillKeyRef.current) {
      prevPrefillKeyRef.current = prefillKey;
      // reset() REPLACES every value, so the form's own defaults have to be
      // carried along. Without them a prefill of `{interactive: true}` — which
      // is all the interactive CLI supplies — wiped every `.default(…)` the
      // schema declared, leaving the form (and the live command preview) empty.
      const overrides = {
        ...options.urlPathParams,
        ...options.autoPrefillData,
        ...options.initialState,
      };
      if (Object.keys(overrides).length > 0) {
        const defaults = formResult.form.formState.defaultValues ?? {};
        // Absent prefill keys must not clobber a default with undefined, so
        // only defined entries are layered over the form's own defaults.
        const definedOverrides = Object.fromEntries(
          Object.entries(overrides).filter(([, value]) => value !== undefined),
        );
        formResult.form.reset({ ...defaults, ...definedOverrides });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- prefillKey is the stable serialized composite
  }, [prefillKey, formResult?.form]);
  /* eslint-enable react-compiler/react-compiler */

  // Stable ref for the latest urlPathParams value so wrappedSubmitForm
  // doesn't need urlPathParams in its dep array (avoids new function on every render).
  const urlPathParamsRef = useRef(options.urlPathParams);
  urlPathParamsRef.current = options.urlPathParams;

  // Stable wrapped submit that reads urlPathParams from ref at call time.
  // useRef + useCallback pattern avoids recreating the function when urlPathParams changes.
  const wrappedSubmitFormRef = useRef<(() => Promise<void> | void) | null>(
    null,
  );
  if (formResult && !wrappedSubmitFormRef.current) {
    wrappedSubmitFormRef.current = (): Promise<void> | void => {
      return formResult.submitForm({
        urlParamVariables: urlPathParamsRef.current,
      });
    };
  }

  // Memoize the wrapped result so we don't return a new object spread every render.
  // Deps: formResult (stable via useApiForm memoization) + wrappedSubmitForm (stable ref).
  /* eslint-disable react-compiler/react-compiler */
  const wrappedFormResult = useMemo(() => {
    if (!formResult || !options.urlPathParams) {
      return formResult;
    }
    // Update the submit function reference to point at the latest formResult.submitForm
    wrappedSubmitFormRef.current = (): Promise<void> | void => {
      return formResult.submitForm({
        urlParamVariables: urlPathParamsRef.current,
      });
    };
    return {
      ...formResult,
      submitForm: wrappedSubmitFormRef.current,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- urlPathParamsKey used for stable comparison
  }, [formResult, !!options.urlPathParams]);
  /* eslint-enable react-compiler/react-compiler */

  return wrappedFormResult;
}
