// eslint-disable-next-line react-compiler/react-compiler
/* eslint-disable react-hooks/rules-of-hooks */

"use client";

import { type FormEvent, useEffect, useMemo } from "react";
import type z from "zod";

import type { EndpointLogger } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-handler/logger";
import type {
  ExtractInput,
  ExtractOutput,
  FieldUsage,
  InferSchemaFromField,
  UnifiedField,
} from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/types";
import type { CreateApiEndpoint } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/endpoint/create";
import type { Methods } from "@/app/api/[locale]/v1/core/system/unified-ui/cli/vibe/endpoints/endpoint-types/core/enums";
import type { UserRoleValue } from "@/app/api/[locale]/v1/core/user/user-roles/enum";

import { useApiForm } from "../mutation-form";
import type {
  ApiFormOptions,
  ApiFormReturn,
  ApiMutationOptions,
} from "../types";
import { mergeFormData } from "./utils";

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
export function useEndpointCreate<
  TEndpoint extends CreateApiEndpoint<any, any, any, any>,
>(
  primaryEndpoint: TEndpoint | null,
  logger: EndpointLogger,
  options: {
    formOptions?: ApiFormOptions<any>;
    mutationOptions?: ApiMutationOptions<any, any, any>;
    urlParams?: any;
    autoPrefillData?: any;
    initialState?: any;
  } = {},
): any {
  // Return null if endpoint is not provided
  if (!primaryEndpoint) {
    return null;
  }
  const {
    formOptions = { persistForm: true },
    mutationOptions = {},
    autoPrefillData,
    initialState,
  } = options;

  // Merge all form data sources (defaultValues < autoPrefillData < initialState < savedData)
  const enhancedFormOptions = useMemo(() => {
    if (!primaryEndpoint) {
      return formOptions;
    }

    // No local storage - savedData is always null

    const mergedDefaultValues = mergeFormData(
      formOptions.defaultValues,
      autoPrefillData,
      initialState,
      undefined,
    );

    return {
      ...formOptions,
      defaultValues: mergedDefaultValues,
    } as ApiFormOptions<any>;
  }, [formOptions, autoPrefillData, initialState, primaryEndpoint]);

  // Use the existing mutation form hook with enhanced options
  const formResult = useApiForm(
    primaryEndpoint,
    logger,
    enhancedFormOptions,
    mutationOptions,
  );

  // Reset form when autoPrefillData becomes available (after initial render)
  useEffect(() => {
    if (
      autoPrefillData &&
      formResult?.form &&
      Object.keys(autoPrefillData).length > 0
    ) {
      formResult.form.reset(autoPrefillData as never);
    }
  }, [autoPrefillData, formResult?.form]);

  // If no URL parameters are needed, return the form result as-is
  if (!options.urlParams) {
    return formResult;
  }

  // If URL parameters are provided, wrap the submitForm function to automatically include them
  if (formResult) {
    const originalSubmitForm = formResult.submitForm;

    const wrappedSubmitForm = (
      event: FormEvent<HTMLFormElement> | undefined,
    ): Promise<void> | void => {
      return originalSubmitForm(event, {
        urlParamVariables: options.urlParams,
      } as never);
    };

    return {
      ...formResult,
      submitForm: wrappedSubmitForm as never,
    };
  }

  return formResult;
}
